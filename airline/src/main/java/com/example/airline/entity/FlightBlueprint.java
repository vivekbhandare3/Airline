package com.example.airline.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "flight_blueprints")
public class FlightBlueprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "airline_id", nullable = false)
    private Airline airline;

    @Column(name = "aircraft_model", nullable = false)
    private String aircraftModel;

    @Column(name = "economy_seats", nullable = false)
    private int economySeats;

    @Column(name = "business_seats", nullable = false)
    private int businessSeats;

    public FlightBlueprint() {}

    public Long getId() {
        return id;
    }

    public Airline getAirline() {
        return airline;
    }

    public void setAirline(Airline airline) {
        this.airline = airline;
    }

    public String getAircraftModel() {
        return aircraftModel;
    }

    public void setAircraftModel(String aircraftModel) {
        this.aircraftModel = aircraftModel;
    }

    public int getEconomySeats() {
        return economySeats;
    }

    public void setEconomySeats(int economySeats) {
        this.economySeats = economySeats;
    }

    public int getBusinessSeats() {
        return businessSeats;
    }

    public void setBusinessSeats(int businessSeats) {
        this.businessSeats = businessSeats;
    }
}
