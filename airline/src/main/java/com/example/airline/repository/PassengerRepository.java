package com.example.airline.repository;

import com.example.airline.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PassengerRepository extends JpaRepository<Passenger, Integer> {
    // Handles saving passenger lists associated with a booking group
}