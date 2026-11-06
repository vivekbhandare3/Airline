package com.example.airline.service;

import com.example.airline.dto.request.RegisterUserRequest;
import com.example.airline.dto.response.LoginResponseDTO;
import com.example.airline.dto.response.UserResponse;
import com.example.airline.entity.type.AuthProviderType;
import com.example.airline.entity.Role;
import com.example.airline.entity.Users;
import com.example.airline.repository.UserRepository;
import com.example.airline.util.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil=jwtUtil;
    }

    public UserResponse registerUser(RegisterUserRequest registerUserRequest) {
        if (userRepository.findByUsername(registerUserRequest.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        Users users = Users.builder()
                .username(registerUserRequest.getUsername())
                .password(passwordEncoder.encode(registerUserRequest.getPassword()))
                .role(registerUserRequest.getRole())
                .email(registerUserRequest.getEmail())
                .build();
        Users savedUsers = userRepository.save(users);
        return new UserResponse(savedUsers.getId(), savedUsers.getUsername(), savedUsers.getEmail(), savedUsers.getRole().name());
    }
    @Transactional
    public ResponseEntity<LoginResponseDTO> handleOAuth2LoginRequest(OAuth2User oAuth2User, String registrationId){
        AuthProviderType providerType=jwtUtil.getProviderTypeFromRegistrationId(registrationId);
        String providerId=jwtUtil.determineProviderIdFromOAuth2User(oAuth2User,registrationId);
        Users user=userRepository.findByProviderIdAndProviderType(providerId,providerType).orElse(null);
        if(user!=null){
            if (!user.isActive()) {
                throw new RuntimeException("Account is inactive");
            }
            if(user.isBlocked()){
                throw new RuntimeException("Account is blocked");
            }
        }
        String email=oAuth2User.getAttribute("email");
        if(user==null && email != null) {
            Users emailUser = userRepository.findByEmail(email).orElse(null);
            if (emailUser != null){
                if(!emailUser.isActive()){
                    throw new RuntimeException(
                            "Account is inactive");
                }

                if(emailUser.isBlocked()){
                    throw new RuntimeException(
                            "Account is blocked");
                }

                emailUser.setProviderId(providerId);
                emailUser.setProviderType(providerType);
                user = userRepository.save(emailUser);
            }
        }
        if(user==null){
            String username=jwtUtil.determineUsernameFromOAuth2User(oAuth2User,providerId);
            user=Users.builder()
                    .username(username)
                    .email(email)
                    .role(Role.USER)
                    .providerType(providerType)
                    .providerId(providerId)
                    .build();
            user=userRepository.save(user);
        }
        String token = jwtUtil.generateJwtToken(user.getUsername());
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }
}