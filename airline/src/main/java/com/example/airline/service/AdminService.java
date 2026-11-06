package com.example.airline.service;

import com.example.airline.entity.Admin;
import com.example.airline.entity.Role;
import com.example.airline.repository.AdminRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder; // Changed from BCryptPasswordEncoder

    public AdminService(AdminRepository adminRepository,
                        PasswordEncoder passwordEncoder) { // Changed here as well
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        if(adminRepository.count() == 0) {
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setEmail("admin@mak.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.SUPER_ADMIN);

            adminRepository.save(admin);
            System.out.println("Default Super Admin created.");
        }
    }

    public Admin authenticate(String username, String password) {
        Admin admin = adminRepository.findByUsername(username);
        if(admin != null && passwordEncoder.matches(password, admin.getPassword())) {
            return admin;
        }
        return null;
    }

    public void save(Admin admin) {
        admin.setRole(Role.ADMIN);
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        adminRepository.save(admin);
    }

    public long countAdmins() {
        return adminRepository.count();
    }

    public Admin findByUsername(String username) {
        return adminRepository.findByUsername(username);
    }
}