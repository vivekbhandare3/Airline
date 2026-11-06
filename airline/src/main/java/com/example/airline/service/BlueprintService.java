package com.example.airline.service;

import com.example.airline.entity.FlightBlueprint;
import com.example.airline.repository.FlightBlueprintRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BlueprintService {

    private final FlightBlueprintRepository blueprintRepository;

    public BlueprintService(FlightBlueprintRepository blueprintRepository) {
        this.blueprintRepository = blueprintRepository;
    }

    public List<FlightBlueprint> findAll() {
        return blueprintRepository.findAll();
    }

    public FlightBlueprint findById(Long id) {
        return blueprintRepository.findById(id).orElse(null);
    }

    @Caching(evict = {
            @CacheEvict(value = "flightSearch", allEntries = true),
            @CacheEvict(value = "flightDetails", allEntries = true)
    })
    public void save(FlightBlueprint blueprint) {
        blueprintRepository.save(blueprint);
    }

    @Caching(evict = {
            @CacheEvict(value = "flightSearch", allEntries = true),
            @CacheEvict(value = "flightDetails", allEntries = true)
    })
    public void deleteById(Long id) {
        blueprintRepository.deleteById(id);
    }
}