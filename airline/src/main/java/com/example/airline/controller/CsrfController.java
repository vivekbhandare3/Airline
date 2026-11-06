package com.example.airline.controller;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CsrfController {

    /**
     * The React app calls this once before any POST/PUT/DELETE. Returning the CsrfToken makes
     * Spring Security write the XSRF-TOKEN cookie, which axios then sends back as X-XSRF-TOKEN.
     */
    @GetMapping("/api/csrf")
    public CsrfToken getCsrfToken(CsrfToken csrfToken) {
        return csrfToken;
    }
}
