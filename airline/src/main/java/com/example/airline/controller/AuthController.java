
package com.example.airline.controller;

import com.example.airline.dto.request.AuthRequest;
import com.example.airline.util.JwtUtil;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.core.AuthenticationException;

import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil,
            UserDetailsService userDetailsService) {

        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }


    // LOGIN
    @PostMapping("/authenticate")
    public ResponseEntity<?> createAuthenticationToken(
            @RequestBody AuthRequest authRequest) {

        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getUsername(),
                            authRequest.getPassword()
                    )
            );

            String jwt = jwtUtil.generateJwtToken(
                    authRequest.getUsername()
            );

            ResponseCookie cookie = ResponseCookie
                    .from("jwt", jwt)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(Duration.ofDays(1))
                    .sameSite("Lax")
                    .build();

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.SET_COOKIE,
                            cookie.toString()
                    )
                    .body(Map.of(
                            "message", "Login Successful"
                    ));

        } catch (AuthenticationException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "error",
                            "Incorrect username or password"
                    ));
        }
    }


    // LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {

        ResponseCookie cookie = ResponseCookie
                .from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        cookie.toString()
                )
                .body(Map.of(
                        "message", "Logged out successfully"
                ));
    }

}
