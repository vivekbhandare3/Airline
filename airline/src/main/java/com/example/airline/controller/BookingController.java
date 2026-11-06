package com.example.airline.controller;

import com.example.airline.dto.PassengerListDTO;
import com.example.airline.entity.Booking;
import com.example.airline.entity.Users;
import com.example.airline.repository.UserRepository;
import com.example.airline.service.BookingRateLimitService;
import com.example.airline.service.BookingService;
import com.example.airline.service.FlightService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;
    private final FlightService flightService;
    private final UserRepository userRepository; // Added to fetch user by JWT Principal
    private final BookingRateLimitService bookingRateLimitService;

    public BookingController(BookingService bookingService, FlightService flightService,
                             UserRepository userRepository, BookingRateLimitService bookingRateLimitService) {
        this.bookingService = bookingService;
        this.flightService = flightService;
        this.userRepository = userRepository;
        this.bookingRateLimitService = bookingRateLimitService;
    }

    @PostMapping("/confirmBooking")
    public ResponseEntity<?> confirmBooking(@RequestBody PassengerListDTO form,
                                            @RequestParam Long flightId,
                                            @RequestParam String flightClass,
                                            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }

        // Redis rate limit (per user) before any booking work is done.
        if (!bookingRateLimitService.isAllowed(principal.getName())) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("error", "Too many booking requests. Please try again later."));
        }

        // Extract user securely from the JWT principal
        Users user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingService.processBooking(form, flightId, flightClass, user);

        if (booking == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Booking failed"));
        }

        return ResponseEntity.ok(Map.of(
                "bookingId", booking.getId(),
                "totalAmount", booking.getTotalAmount()
        ));
    }

    @PostMapping("/processPayment")
    public ResponseEntity<?> processPayment(@RequestParam Long bookingId) {
        try {
            bookingService.confirmPayment(bookingId);
            return ResponseEntity.ok(Map.of("message", "Payment Confirmed"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/ticket/{bookingId}")
    public ResponseEntity<?> viewTicket(@PathVariable Long bookingId) {
        Booking booking = bookingService.findById(bookingId);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(Map.of(
                "booking", booking,
                "flight", booking.getFlight()
        ));
    }

    @PostMapping("/cancelBooking/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }

        Users user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String result = bookingService.cancelBooking(id, user);

        if (result.equals("SUCCESS")) {
            return ResponseEntity.ok(Map.of("message", "Booking cancelled. Refund processed."));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", result));
        }
    }
}