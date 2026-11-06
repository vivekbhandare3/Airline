package com.example.airline.controller;

import com.example.airline.dto.request.RegisterUserRequest;
import com.example.airline.dto.response.UserResponse;
import com.example.airline.entity.Role;
import com.example.airline.entity.Users;
import com.example.airline.repository.UserRepository;
import com.example.airline.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    public UserController(UserService userService,UserRepository userRepository) {
        this.userService = userService;
        this.userRepository=userRepository;
    }
    @PostMapping("/register/user")
    public ResponseEntity<UserResponse> registerUser(@RequestBody RegisterUserRequest request) {
        request.setRole(Role.USER);
        UserResponse response = userService.registerUser(request);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/admin/users")
    public ResponseEntity<List<Users>> getAllUsers() {
        List<Users> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
}