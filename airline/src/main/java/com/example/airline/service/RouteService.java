package com.example.airline.service;

import com.example.airline.entity.Route;
import com.example.airline.repository.RouteRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RouteService {

    private final RouteRepository routeRepository;

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public List<Route> findAll() {
        return routeRepository.findAll();
    }

    public Route findById(Long id) {
        return routeRepository.findById(id).orElse(null);
    }

    @Caching(evict = {
            @CacheEvict(value = "flightSearch", allEntries = true),
            @CacheEvict(value = "flightDetails", allEntries = true)
    })
    public void save(Route route) {
        routeRepository.save(route);
    }

    @Caching(evict = {
            @CacheEvict(value = "flightSearch", allEntries = true),
            @CacheEvict(value = "flightDetails", allEntries = true)
    })
    public void deleteById(Long id) {
        routeRepository.deleteById(id);
    }
}