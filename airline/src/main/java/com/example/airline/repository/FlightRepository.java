package com.example.airline.repository;

import com.example.airline.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface FlightRepository extends JpaRepository<Flight, Long> {

    @Query("SELECT f FROM Flight f WHERE " +
           "f.route.origin = :origin AND " +
           "f.route.destination = :destination AND " +
           "f.departureDate = :date AND " +
           "(f.availableEconomySeats >= :passengers OR f.availableBusinessSeats >= :passengers)")
    List<Flight> searchFlights(@Param("origin") String origin,
                               @Param("destination") String destination,
                               @Param("date") LocalDate date,
                               @Param("passengers") int passengers);
    @Query("SELECT f.id FROM Flight f")
    List<Long> findAllFlightIds();
}