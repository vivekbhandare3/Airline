package com.example.airline.service;

import com.example.airline.dto.response.FlightResponse;
import com.example.airline.dto.response.FlightSearchCache;
import com.example.airline.entity.Booking;
import com.example.airline.entity.Flight;
import com.example.airline.repository.BookingRepository;
import com.example.airline.repository.FlightRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlightService {

    private static final Logger log = LoggerFactory.getLogger(FlightService.class);

    private final FlightRepository flightRepository;
    private final BookingRepository bookingRepository;
    private final EmailService emailService;
    private final CacheManager cacheManager;
    private final FlightBloomFilterService bloomFilterService;

    public FlightService(FlightRepository flightRepository,
                         BookingRepository bookingRepository,
                         EmailService emailService,
                         CacheManager cacheManager,
                         FlightBloomFilterService bloomFilterService) {
        this.flightRepository = flightRepository;
        this.bookingRepository = bookingRepository;
        this.emailService = emailService;
        this.cacheManager = cacheManager;
        this.bloomFilterService = bloomFilterService;
    }

    public List<Flight> findAll() {
        return flightRepository.findAll();
    }

    public Flight findById(Long id) {
        return flightRepository.findById(id).orElse(null);
    }

    // Admin add / update: cached search results and details may now be wrong, so clear them.
    @Caching(evict = {
            @CacheEvict(value = "flightSearch", allEntries = true),
            @CacheEvict(value = "flightDetails", allEntries = true)
    })
    public Flight save(Flight flight) {
        Flight saved = flightRepository.save(flight);
        bloomFilterService.addFlightId(saved.getId());   // idempotent (CF.ADDNX)
        return saved;
    }

    @Caching(evict = {
            @CacheEvict(value = "flightSearch", allEntries = true),
            @CacheEvict(value = "flightDetails", allEntries = true)
    })
    public void deleteById(Long id) {
        List<Booking> activeBookings = bookingRepository.findByFlightId(id);
        if (!activeBookings.isEmpty()) {
            throw new RuntimeException("Cannot delete flight with active bookings. Please cancel the flight instead.");
        }
        flightRepository.deleteById(id);
        bloomFilterService.removeFlightId(id);
    }

    @Caching(evict = {
            @CacheEvict(value = "flightSearch", allEntries = true),
            @CacheEvict(value = "flightDetails", allEntries = true)
    })
    public void updateStatus(Long flightId, String status) {
        Flight flight = findById(flightId);
        if (flight != null) {

            flight.setStatus(status);
            save(flight);

            List<Booking> affectedBookings = bookingRepository.findByFlightId(flightId);

            for (Booking b : affectedBookings) {
                if ("CONFIRMED".equals(b.getStatus())) {
                    emailService.sendDelayNotification(b, status);
                }
            }
        }
    }

    /**
     * Flight search with a manual Redis cache (cache-aside).
     * Key = origin-destination-date-passengers. If Redis fails, MySQL is used instead.
     */
    public List<FlightResponse> searchFlights(String origin, String destination, LocalDate date, int passengers) {

        String cacheKey = origin + "-" + destination + "-" + date + "-" + passengers;

        Cache cache = cacheManager.getCache("flightSearch");
        // Very long user-supplied keys are not cached (protects Redis memory).
        boolean useCache = cache != null && cacheKey.length() <= 200;

        if (useCache) {
            try {
                FlightSearchCache cached = cache.get(cacheKey, FlightSearchCache.class);
                if (cached != null && cached.getFlights() != null) {
                    log.info("Flight search CACHE HIT. Key: {}", cacheKey);
                    return cached.getFlights();
                }
            } catch (Exception e) {
                log.warn("Redis cache read failed; fetching flights from MySQL: {}", e.getMessage());
            }
            log.info("Flight search CACHE MISS. Key: {}", cacheKey);
        }

        List<FlightResponse> flights = flightRepository
                .searchFlights(origin, destination, date, passengers)
                .stream()
                .map(FlightResponse::from)
                .collect(Collectors.toCollection(ArrayList::new));

        if (useCache) {
            try {
                cache.put(cacheKey, new FlightSearchCache(flights));
                log.info("Flight search SAVED TO REDIS. Key: {}", cacheKey);
            } catch (Exception e) {
                log.warn("Redis cache write failed. Flights were still fetched from MySQL. Key: {}",
                        cacheKey, e);
            }
        }

        return flights;
    }

    /**
     * Flight details with annotation-based caching.
     * sync = true: if many requests miss at once, only one loads from MySQL (prevents cache stampede).
     * A missing flight throws, so "not found" is never cached.
     */
    @Cacheable(value = "flightDetails", key = "#id", sync = true)
    public FlightResponse getFlightDetails(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Flight not found"));
        return FlightResponse.from(flight);
    }
}
