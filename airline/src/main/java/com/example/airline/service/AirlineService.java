package com.example.airline.service;

import com.example.airline.entity.Airline;
import com.example.airline.repository.AirlineRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AirlineService {

    private final AirlineRepository airlineRepository;

    public AirlineService(AirlineRepository airlineRepository) {
        this.airlineRepository = airlineRepository;
    }

    public List<Airline> findAll() {
        return airlineRepository.findAll();
    }

    @Caching(evict = {
            @CacheEvict(value = "flightSearch", allEntries = true),
            @CacheEvict(value = "flightDetails", allEntries = true)
    })
    public void save(Airline airline) {
        airlineRepository.save(airline);
    }

    @Caching(evict = {
            @CacheEvict(value = "flightSearch", allEntries = true),
            @CacheEvict(value = "flightDetails", allEntries = true)
    })
    public void deleteById(Long id) {
        airlineRepository.deleteById(id);
    }
}