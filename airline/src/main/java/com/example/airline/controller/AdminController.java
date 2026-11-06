package com.example.airline.controller;

import com.example.airline.dto.request.AdminLoginRequest;
import com.example.airline.entity.Admin;
import com.example.airline.entity.Role;
import com.example.airline.service.AdminService;
import com.example.airline.util.JwtUtil;
import org.springframework.http.ResponseCookie;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    private final AdminService adminService;
    private final JwtUtil jwtUtil;

    public AdminController(AdminService adminService, JwtUtil jwtUtil) {
        this.adminService = adminService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request){

        Admin admin = adminService.authenticate(
                request.getUsername(),
                request.getPassword());

        if(admin == null){
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message","Invalid username or password"));
        }

        String token = jwtUtil.generateJwtToken(admin.getUsername());

        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .sameSite("Lax")
                .build();

        // Safe check to prevent NullPointerException
        String roleName = (admin.getRole() != null) ? admin.getRole().name() : "SUPER_ADMIN";

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of(
                        "role", roleName,
                        "username", admin.getUsername()
                ));
    }

    @PostMapping("/registerAdmin")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin admin, HttpServletRequest request) {

        String token = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "No authentication token provided."));
        }

        try {
            // Manual authorization check
            String username = jwtUtil.extractUsername(token);
            Admin requester = adminService.findByUsername(username);

            if (requester == null || requester.getRole() != Role.SUPER_ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Access Denied: Only the Super Admin can register new admins."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or expired token."));
        }

        adminService.save(admin);

        return ResponseEntity.ok(Map.of("message", "Admin created successfully"));
    }
    @GetMapping("/profile")
    public ResponseEntity<?> getAdminProfile(java.security.Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        Admin admin = adminService.findByUsername(principal.getName());

        if (admin == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin not found");
        }

        return ResponseEntity.ok(Map.of(
                "username", admin.getUsername(),
                "role", admin.getRole().name()
        ));
    }
}