package com.example.airline.controller;

import com.example.airline.entity.Route;
import com.example.airline.service.RouteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/routes")
@CrossOrigin(origins = "http://localhost:5173")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping
    public ResponseEntity<List<Route>> routes() {
        return ResponseEntity.ok(routeService.findAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> addRoute(@RequestBody Route route) {
        routeService.save(route);
        return ResponseEntity.ok(Map.of("message", "Route added successfully"));
    }

    @GetMapping("/edit/{id}")
    public ResponseEntity<?> editRoute(@PathVariable Long id) {
        Route route = routeService.findById(id);
        if (route == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(route);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateRoute(@RequestBody Route route) {
        routeService.save(route);
        return ResponseEntity.ok(Map.of("message", "Route updated successfully"));
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<?> deleteRoute(@PathVariable Long id) {
        routeService.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Route deleted successfully"));
    }
}