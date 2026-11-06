package com.example.airline.service;

import com.example.airline.dto.PassengerDTO;
import com.example.airline.dto.PassengerListDTO;
import com.example.airline.entity.Booking;
import com.example.airline.entity.Flight;
import com.example.airline.entity.Passenger;
import com.example.airline.entity.Users;
import com.example.airline.repository.BookingRepository;
import com.example.airline.repository.FlightRepository;
import com.example.airline.repository.PassengerRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PassengerRepository passengerRepository;
    private final FlightRepository flightRepository;
    private final EmailService emailService;

    public BookingService(BookingRepository bookingRepository,
                          PassengerRepository passengerRepository,
                          FlightRepository flightRepository,
                          EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.passengerRepository = passengerRepository;
        this.flightRepository = flightRepository;
        this.emailService = emailService;
    }

    public List<Booking> findBookingsByFlight(Long flightId) {
        return bookingRepository.findByFlightId(flightId);
    }

    // --- 1. CREATE BOOKING ---
    @Transactional
    public Booking processBooking(PassengerListDTO form, Long flightId, String flightClass, Users user) {

        Flight flight = flightRepository.findById(flightId).orElse(null);
        if (flight == null) return null;

        double pricePerSeat = flightClass.equals("Economy") ? flight.getEconomyPrice() : flight.getBusinessPrice();
        double totalAmount = pricePerSeat * form.getPassengers().size();

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setFlight(flight);
        booking.setSeatClass(flightClass);
        booking.setStatus("PENDING");
        booking.setBookingDateTime(LocalDateTime.now());
        booking.setBookingGroupId(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setTotalAmount(totalAmount);

        booking = bookingRepository.save(booking);

        for (PassengerDTO dto : form.getPassengers()) {
            Passenger p = new Passenger();
            p.setBooking(booking);
            p.setFlight(flight);
            p.setUser(user);
            p.setFirstName(dto.getFirstName());
            p.setLastName(dto.getLastName());
            p.setGender(dto.getGender());
            p.setTitle(dto.getTitle());
            p.setMobileNumber(dto.getMobileNumber());
            p.setSeatClass(flightClass);
            p.setDateOfBirth(dto.getDateOfBirth());

            passengerRepository.save(p);
        }

        return booking;
    }

    // --- 2. PROCESS PAYMENT (FIXED) ---
    // Seats change here, so clear every cached search plus this flight's cached details.
    @Caching(evict = {
            @CacheEvict(value = "flightSearch", allEntries = true, condition = "#result != null"),
            @CacheEvict(value = "flightDetails", key = "#result.flight.id", condition = "#result != null")
    })
    @Transactional
    public Booking confirmPayment(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);

        // FIX: Check if already confirmed to prevent double deduction
        if (booking != null && !booking.getStatus().equals("CONFIRMED")) {

            Flight f = booking.getFlight();
            int passengersCount = booking.getPassengers().size();

            // FIX: Check if seats are STILL available at this exact moment
            if ("Economy".equalsIgnoreCase(booking.getSeatClass())) {
                if (f.getAvailableEconomySeats() < passengersCount) {
                    throw new RuntimeException("Payment Failed: Seats are no longer available.");
                }
                f.setAvailableEconomySeats(f.getAvailableEconomySeats() - passengersCount);
            } else {
                if (f.getAvailableBusinessSeats() < passengersCount) {
                    throw new RuntimeException("Payment Failed: Seats are no longer available.");
                }
                f.setAvailableBusinessSeats(f.getAvailableBusinessSeats() - passengersCount);
            }

            flightRepository.save(f);

            booking.setStatus("CONFIRMED"); // Mark as confirmed
            bookingRepository.save(booking);
            emailService.sendBookingConfirmation(booking);
        }
        return booking;
    }

    // --- 3. CANCEL BOOKING (FIXED) ---
    // Seats are returned to inventory on a successful cancel, so clear the flight caches.
    @Caching(evict = {
            @CacheEvict(value = "flightSearch", allEntries = true, condition = "'SUCCESS'.equals(#result)"),
            @CacheEvict(value = "flightDetails", allEntries = true, condition = "'SUCCESS'.equals(#result)")
    })
    @Transactional
    public String cancelBooking(Long bookingId, Users loggedInUser) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) return "Booking not found";

        // FIX: Privacy Check - Ensure logged in user OWNS this booking
        if (!booking.getUser().getId().equals(loggedInUser.getId())) {
            return "Error: You are not authorized to cancel this booking.";
        }

        if ("CANCELLED".equals(booking.getStatus())) {
            return "Booking is already cancelled.";
        }

        // Check 1 Hour Rule
        LocalDateTime flightDeparture = LocalDateTime.of(booking.getFlight().getDepartureDate(), booking.getFlight().getDepartureTime());
        LocalDateTime oneHourBefore = flightDeparture.minusHours(1);

        if (LocalDateTime.now().isAfter(oneHourBefore)) {
            return "Cannot cancel ticket within 1 hour of departure.";
        }

        // Refund Seats back to Inventory
        if ("CONFIRMED".equals(booking.getStatus())) {
            Flight f = booking.getFlight();
            int passengersCount = booking.getPassengers().size();

            if ("Economy".equalsIgnoreCase(booking.getSeatClass())) {
                f.setAvailableEconomySeats(f.getAvailableEconomySeats() + passengersCount);
            } else {
                f.setAvailableBusinessSeats(f.getAvailableBusinessSeats() + passengersCount);
            }
            flightRepository.save(f);
        }

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
        emailService.sendCancellationNotice(booking);

        return "SUCCESS";
    }

    public Booking findById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public List<Booking> getBookingsByUser(Users user) {
        return bookingRepository.findByUser(user);
    }
}