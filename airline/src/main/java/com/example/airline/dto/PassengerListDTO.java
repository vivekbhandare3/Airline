package com.example.airline.dto;

import java.util.List;

public class PassengerListDTO {

    private String bookingGroupId;
    private List<PassengerDTO> passengers;

    // getters & setters
    public String getBookingGroupId() {
        return bookingGroupId;
    }

    public void setBookingGroupId(String bookingGroupId) {
        this.bookingGroupId = bookingGroupId;
    }

    public List<PassengerDTO> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<PassengerDTO> passengers) {
        this.passengers = passengers;
    }
}
