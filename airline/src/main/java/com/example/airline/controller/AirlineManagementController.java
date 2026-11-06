package com.example.airline.controller;

import com.example.airline.entity.Airline;
import com.example.airline.service.AirlineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController // Changed from @Controller
@RequestMapping("/admin/airlines")
@CrossOrigin(origins = "http://localhost:5173")
public class AirlineManagementController {

    private final AirlineService airlineService;

    public AirlineManagementController(AirlineService airlineService) {
        this.airlineService = airlineService;
    }

    @GetMapping
    public ResponseEntity<List<Airline>> manageAirlines() {
        return ResponseEntity.ok(airlineService.findAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> addAirline(@RequestBody Airline airline) {
        airlineService.save(airline);
        return ResponseEntity.ok(Map.of("message", "Airline added successfully"));
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<?> deleteAirline(@PathVariable Long id) {
        airlineService.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Airline deleted successfully"));
    }
}