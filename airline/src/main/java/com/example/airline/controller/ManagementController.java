package com.example.airline.controller;

import com.example.airline.entity.*;
import com.example.airline.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/manage")
@CrossOrigin(origins = "http://localhost:5173")
public class ManagementController {

    private final FlightService flightService;
    private final AirlineService airlineService;
    private final RouteService routeService;
    private final BlueprintService blueprintService;
    private final BookingService bookingService;

    public ManagementController(FlightService flightService,
                                AirlineService airlineService,
                                RouteService routeService,
                                BlueprintService blueprintService,
                                BookingService bookingService) {
        this.flightService = flightService;
        this.airlineService = airlineService;
        this.routeService = routeService;
        this.blueprintService = blueprintService;
        this.bookingService = bookingService;
    }

    @GetMapping("/flights")
    public ResponseEntity<List<Flight>> manageFlights() {
        return ResponseEntity.ok(flightService.findAll());
    }

    @PostMapping("/updateStatus")
    public ResponseEntity<?> updateFlightStatus(@RequestParam Long flightId, @RequestParam String status) {
        flightService.updateStatus(flightId, status);
        return ResponseEntity.ok(Map.of("message", "Flight status updated"));
    }

    // NEW API endpoint specifically for the React "Add Flight" form dropdowns
    @GetMapping("/flights/form-data")
    public ResponseEntity<?> getFlightFormData() {
        return ResponseEntity.ok(Map.of(
                "airlines", airlineService.findAll(),
                "routes", routeService.findAll(),
                "blueprints", blueprintService.findAll()
        ));
    }

    @PostMapping("/flights/add")
    public ResponseEntity<?> addFlight(@RequestBody Flight flight,
                                       @RequestParam Long flightBlueprintId) {
        FlightBlueprint blueprint = blueprintService.findById(flightBlueprintId);
        if (blueprint != null) {
            flight.setAvailableEconomySeats(blueprint.getEconomySeats());
            flight.setAvailableBusinessSeats(blueprint.getBusinessSeats());
            flight.setFlightBlueprint(blueprint);
        }
        flightService.save(flight);
        return ResponseEntity.ok(Map.of("message", "Flight added successfully"));
    }

    @GetMapping("/flights/edit/{id}")
    public ResponseEntity<?> editFlight(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of(
                "flight", flightService.findById(id),
                "airlines", airlineService.findAll(),
                "routes", routeService.findAll(),
                "blueprints", blueprintService.findAll()
        ));
    }

    @PostMapping("/flights/update")
    public ResponseEntity<?> updateFlight(@RequestBody Flight flight) {
        flightService.save(flight);
        return ResponseEntity.ok(Map.of("message", "Flight updated successfully"));
    }

    @PostMapping("/flights/delete/{id}")
    public ResponseEntity<?> deleteFlight(@PathVariable Long id) {
        flightService.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Flight deleted successfully"));
    }

    @GetMapping("/flights/view/{id}")
    public ResponseEntity<?> viewFlightPassengers(@PathVariable Long id) {
        Flight flight = flightService.findById(id);
        if (flight == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(Map.of(
                "flight", flight,
                "bookings", bookingService.findBookingsByFlight(id)
        ));
    }
}