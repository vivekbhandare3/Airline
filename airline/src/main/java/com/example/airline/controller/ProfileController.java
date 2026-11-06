package com.example.airline.controller;

import com.example.airline.entity.Booking;
import com.example.airline.entity.Users;
import com.example.airline.repository.UserRepository;
import com.example.airline.service.BookingService; // Imported BookingService
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    private final UserRepository userRepository;
    private final BookingService bookingService; // Added BookingService

    // Injected BookingService into the constructor
    public ProfileController(UserRepository userRepository, BookingService bookingService) {
        this.userRepository = userRepository;
        this.bookingService = bookingService;
    }

    @GetMapping("/user/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Unauthorized"));
        }

        String username = authentication.getName();
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Booking> userBookings = bookingService.getBookingsByUser(user);

        // Send the data exactly how React expects it: { user: {...}, bookings: [...] }
        return ResponseEntity.ok(
                Map.of(
                        "user", Map.of(
                                "id", user.getId(),
                                "username", user.getUsername(),
                                "email", user.getEmail(),
                                "role", user.getRole().name()
                        ),
                        "bookings", userBookings // Included the bookings!
                )
        );
    }
}