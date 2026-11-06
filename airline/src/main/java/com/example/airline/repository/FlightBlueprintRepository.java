package com.example.airline.repository;

import com.example.airline.entity.FlightBlueprint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlightBlueprintRepository extends JpaRepository<FlightBlueprint, Long> {
	
}
