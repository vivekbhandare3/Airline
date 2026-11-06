package com.example.airline.security;

import com.example.airline.dto.response.LoginResponseDTO;
import com.example.airline.service.UserService;
import jakarta.servlet.http.Cookie; // Add this import
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException{
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = token.getPrincipal();
        String registrationId = token.getAuthorizedClientRegistrationId();

        ResponseEntity<LoginResponseDTO> loginResponse = userService.handleOAuth2LoginRequest(oAuth2User, registrationId);
        String jwtToken = loginResponse.getBody().getToken();

        // 1. Create the HTTP-Only Cookie
        Cookie jwtCookie = new Cookie("jwt", jwtToken);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(60 * 60);
        response.addCookie(jwtCookie);

        //Kill the JSESSIONID to force JWT authentication ---
        request.getSession().invalidate(); // Destroy session on the server
        Cookie jsessionCookie = new Cookie("JSESSIONID", null);
        jsessionCookie.setMaxAge(0);
        jsessionCookie.setPath("/");
        response.addCookie(jsessionCookie); // Destroy session cookie in the browser

        // Redirect to React home page
        response.sendRedirect("http://localhost:5173/");
    }
}