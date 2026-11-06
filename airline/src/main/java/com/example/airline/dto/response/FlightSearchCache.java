package com.example.airline.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/** Holder stored in Redis for one search (origin, destination, date, passengers). */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlightSearchCache {
    private List<FlightResponse> flights;
}
