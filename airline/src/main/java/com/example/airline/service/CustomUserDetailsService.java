package com.example.airline.service;

import com.example.airline.entity.Admin;
import com.example.airline.entity.Users;
import com.example.airline.repository.AdminRepository;
import com.example.airline.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // 1. Check if the username belongs to a standard user
        Optional<Users> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            return userOpt.get();
        }

        // 2. If not found in users, check the admins
        Admin admin = adminRepository.findByUsername(username);
        if (admin != null) {
            Set<SimpleGrantedAuthority> authorities = new HashSet<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_" + admin.getRole().name()));

            Set<SimpleGrantedAuthority> permissions = admin.getRole().getPermissions().stream()
                    .map(p -> new SimpleGrantedAuthority(p.name()))
                    .collect(Collectors.toSet());
            authorities.addAll(permissions);

            // Construct and return a Spring Security User object for the Admin
            return new User(admin.getUsername(), admin.getPassword(), authorities);
        }

        throw new UsernameNotFoundException("Username not found in any database");
    }
}