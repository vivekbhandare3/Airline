package com.example.airline.repository;

import com.example.airline.entity.Booking;
import com.example.airline.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUser(Users user);
 // Add this inside the interface
    List<Booking> findByFlightId(Long flightId);
}
