package com.example.airline.dto.request;

import com.example.airline.entity.Role;
import lombok.Data;

@Data
public class RegisterUserRequest {
    public String username;
    public String password;
    public Role role;
    public String email;
}
