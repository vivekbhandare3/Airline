package com.example.airline.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "flights")
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Airline airline;

    @ManyToOne
    private Route route;

    @ManyToOne
    @JoinColumn(name = "blueprint_id")
    private FlightBlueprint flightBlueprint;

    private LocalDate departureDate;
    private LocalTime departureTime;
    
    @Column(nullable = false)
    private LocalDate arrivalDate;
    
    @Column(nullable = false)
    private LocalTime arrivalTime;

    @Column(nullable = false)
    private double economyPrice;
    
    @Column(nullable = false)
    private double businessPrice;

    private int availableEconomySeats;
    private int availableBusinessSeats;

    private String status;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Airline getAirline() { return airline; }
    public void setAirline(Airline airline) { this.airline = airline; }

    public Route getRoute() { return route; }
    public void setRoute(Route route) { this.route = route; }

    // --- NEW GETTER/SETTER ---
    public FlightBlueprint getFlightBlueprint() { return flightBlueprint; }
    public void setFlightBlueprint(FlightBlueprint flightBlueprint) { this.flightBlueprint = flightBlueprint; }
    // -------------------------

    public LocalDate getDepartureDate() { return departureDate; }
    public void setDepartureDate(LocalDate departureDate) { this.departureDate = departureDate; }

    public LocalTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalTime departureTime) { this.departureTime = departureTime; }

    public LocalDate getArrivalDate() { return arrivalDate; }
    public void setArrivalDate(LocalDate arrivalDate) { this.arrivalDate = arrivalDate; }

    public LocalTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalTime arrivalTime) { this.arrivalTime = arrivalTime; }

    public double getEconomyPrice() { return economyPrice; }
    public void setEconomyPrice(double economyPrice) { this.economyPrice = economyPrice; }

    public double getBusinessPrice() { return businessPrice; }
    public void setBusinessPrice(double businessPrice) { this.businessPrice = businessPrice; }

    public int getAvailableEconomySeats() { return availableEconomySeats; }
    public void setAvailableEconomySeats(int availableEconomySeats) { this.availableEconomySeats = availableEconomySeats; }

    public int getAvailableBusinessSeats() { return availableBusinessSeats; }
    public void setAvailableBusinessSeats(int availableBusinessSeats) { this.availableBusinessSeats = availableBusinessSeats; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}