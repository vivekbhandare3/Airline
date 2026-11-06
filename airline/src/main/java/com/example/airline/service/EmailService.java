package com.example.airline.service;

import com.example.airline.entity.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Inject from application.properties
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendBookingConfirmation(Booking booking) {
        if (booking == null || booking.getUser() == null) return;

        String to = booking.getUser().getEmail();
        String subject = "Booking Confirmed - PNR: " + booking.getBookingGroupId();
        String text = "Dear " + booking.getUser().getUsername() + ",\n\n" +
                      "Your flight has been successfully booked!\n\n" +
                      "Flight: " + booking.getFlight().getAirline().getName() + "\n" +
                      "Route: " + booking.getFlight().getRoute().getOrigin() + " to " + booking.getFlight().getRoute().getDestination() + "\n" +
                      "Date: " + booking.getFlight().getDepartureDate() + "\n" +
                      "Class: " + booking.getSeatClass() + "\n" +
                      "Passengers: " + booking.getPassengers().size() + "\n" +
                      "Total Amount: ₹" + booking.getTotalAmount() + "\n\n" +
                      "Thank you for choosing MAK Airlines.";

        sendEmail(to, subject, text);
    }

    public void sendCancellationNotice(Booking booking) {
        if (booking == null || booking.getUser() == null) return;

        String to = booking.getUser().getEmail();
        String subject = "Booking Cancelled - PNR: " + booking.getBookingGroupId();
        String text = "Dear " + booking.getUser().getUsername() + ",\n\n" +
                      "Your booking with PNR " + booking.getBookingGroupId() + " has been cancelled.\n" +
                      "A refund has been initiated.\n\n" +
                      "Regards,\nMAK Airlines Team";

        sendEmail(to, subject, text);
    }

    private void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            message.setFrom(fromEmail); // Use the variable
            
            mailSender.send(message);
            System.out.println("Email sent successfully to " + to);
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }
    public void sendDelayNotification(Booking booking, String newStatus) {
        String to = booking.getUser().getEmail();
        String subject = "Flight Update: " + booking.getFlight().getAirline().getName();
        
        String body = "Dear " + booking.getUser().getUsername() + ",\n" +
                      "Your flight " + booking.getFlight().getRoute().getOrigin() + " to " + 
                      booking.getFlight().getRoute().getDestination() + " has been updated.\n" +
                      "New Status: " + newStatus + "\n\n" +
                      "Please check your dashboard for details.";
                      
        sendEmail(to, subject, body);
    }
}