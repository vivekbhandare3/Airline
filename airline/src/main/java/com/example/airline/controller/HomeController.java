package com.example.airline.controller;

import com.example.airline.dto.response.FlightResponse;
import com.example.airline.service.FlightBloomFilterService;
import com.example.airline.service.FlightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController // Changed from @Controller
@CrossOrigin(origins = "http://localhost:5173") // Explicitly allow React
public class HomeController {

    private final FlightService flightService;
    private final FlightBloomFilterService bloomFilterService;

    public HomeController(FlightService flightService, FlightBloomFilterService bloomFilterService) {
        this.flightService = flightService;
        this.bloomFilterService = bloomFilterService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<FlightResponse>> search(@RequestParam String origin,
                                                       @RequestParam String destination,
                                                       @RequestParam String date,
                                                       @RequestParam(defaultValue = "1") int passengers) {

        LocalDate searchDate = LocalDate.parse(date);
        List<FlightResponse> flights = flightService.searchFlights(origin, destination, searchDate, passengers);

        return ResponseEntity.ok(flights);
    }

    @GetMapping("/flightDetails/{id}")
    public ResponseEntity<FlightResponse> flightDetails(@PathVariable Long id) {

        // Cuckoo filter: IDs that definitely do not exist are rejected before touching cache or MySQL.
        if (!bloomFilterService.mightExist(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            return ResponseEntity.ok(flightService.getFlightDetails(id));
        } catch (ResponseStatusException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
