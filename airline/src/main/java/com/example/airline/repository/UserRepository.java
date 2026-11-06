package com.example.airline.repository;

import com.example.airline.entity.type.AuthProviderType;
import com.example.airline.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByUsername(String username);
    Optional<Users> findByProviderIdAndProviderType(String providerId, AuthProviderType providerType);
    Optional<Users> findByEmail(String email);

}
