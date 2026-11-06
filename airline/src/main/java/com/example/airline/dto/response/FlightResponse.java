package com.example.airline.dto.response;

import com.example.airline.entity.Airline;
import com.example.airline.entity.Flight;
import com.example.airline.entity.FlightBlueprint;
import com.example.airline.entity.Route;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Cache-safe copy of a Flight. JPA entities are never stored in Redis.
 * The JSON shape is identical to the Flight entity, so the React app needs no changes.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlightResponse {

    private Long id;
    private AirlineInfo airline;
    private RouteInfo route;
    private BlueprintInfo flightBlueprint;
    private LocalDate departureDate;
    private LocalTime departureTime;
    private LocalDate arrivalDate;
    private LocalTime arrivalTime;
    private double economyPrice;
    private double businessPrice;
    private int availableEconomySeats;
    private int availableBusinessSeats;
    private String status;

    public static FlightResponse from(Flight f) {
        FlightResponse r = new FlightResponse();
        r.setId(f.getId());
        r.setAirline(AirlineInfo.from(f.getAirline()));
        r.setRoute(RouteInfo.from(f.getRoute()));
        r.setFlightBlueprint(BlueprintInfo.from(f.getFlightBlueprint()));
        r.setDepartureDate(f.getDepartureDate());
        r.setDepartureTime(f.getDepartureTime());
        r.setArrivalDate(f.getArrivalDate());
        r.setArrivalTime(f.getArrivalTime());
        r.setEconomyPrice(f.getEconomyPrice());
        r.setBusinessPrice(f.getBusinessPrice());
        r.setAvailableEconomySeats(f.getAvailableEconomySeats());
        r.setAvailableBusinessSeats(f.getAvailableBusinessSeats());
        r.setStatus(f.getStatus());
        return r;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AirlineInfo {
        private Long id;
        private String name;
        private String code;

        static AirlineInfo from(Airline a) {
            return a == null ? null : new AirlineInfo(a.getId(), a.getName(), a.getCode());
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RouteInfo {
        private Long id;
        private String origin;
        private String destination;

        static RouteInfo from(Route r) {
            return r == null ? null : new RouteInfo(r.getId(), r.getOrigin(), r.getDestination());
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BlueprintInfo {
        private Long id;
        private AirlineInfo airline;
        private String aircraftModel;
        private int economySeats;
        private int businessSeats;

        static BlueprintInfo from(FlightBlueprint b) {
            return b == null ? null : new BlueprintInfo(
                    b.getId(),
                    AirlineInfo.from(b.getAirline()),
                    b.getAircraftModel(),
                    b.getEconomySeats(),
                    b.getBusinessSeats());
        }
    }
}
