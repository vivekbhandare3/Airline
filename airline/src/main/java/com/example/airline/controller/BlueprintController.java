package com.example.airline.controller;

import com.example.airline.entity.FlightBlueprint;
import com.example.airline.service.AirlineService;
import com.example.airline.service.BlueprintService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/blueprints")
@CrossOrigin(origins = "http://localhost:5173")
public class BlueprintController {

    private final AirlineService airlineService;
    private final BlueprintService blueprintService;

    public BlueprintController(AirlineService airlineService, BlueprintService blueprintService) {
        this.airlineService = airlineService;
        this.blueprintService = blueprintService;
    }

    @GetMapping
    public ResponseEntity<List<FlightBlueprint>> blueprints() {
        return ResponseEntity.ok(blueprintService.findAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> addBlueprint(@RequestBody FlightBlueprint blueprint) {
        blueprintService.save(blueprint);
        return ResponseEntity.ok(Map.of("message", "Blueprint added successfully"));
    }

    @GetMapping("/edit/{id}")
    public ResponseEntity<?> editBlueprint(@PathVariable Long id) {
        FlightBlueprint blueprint = blueprintService.findById(id);
        if (blueprint == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(Map.of(
                "blueprint", blueprint,
                "airlines", airlineService.findAll()
        ));
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateBlueprint(@RequestBody FlightBlueprint blueprint) {
        blueprintService.save(blueprint);
        return ResponseEntity.ok(Map.of("message", "Blueprint updated successfully"));
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<?> deleteBlueprint(@PathVariable Long id) {
        blueprintService.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Blueprint deleted successfully"));
    }
}