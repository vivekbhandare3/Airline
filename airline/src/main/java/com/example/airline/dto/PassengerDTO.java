package com.example.airline.dto;

import java.time.LocalDate;

public class PassengerDTO {

    private String title;
    private String firstName;
    private String lastName;
    private String seatClass;
    
    // --- NEW FIELDS ---
    private String gender;
    private String mobileNumber;
    private LocalDate dateOfBirth;
    // ------------------

    // Getters & Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getSeatClass() { return seatClass; }
    public void setSeatClass(String seatClass) { this.seatClass = seatClass; }

    // --- NEW GETTERS & SETTERS ---
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
}