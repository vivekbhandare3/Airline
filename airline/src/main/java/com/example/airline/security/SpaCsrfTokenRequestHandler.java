package com.example.airline.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.csrf.CsrfTokenRequestHandler;
import org.springframework.security.web.csrf.XorCsrfTokenRequestAttributeHandler;
import org.springframework.util.StringUtils;

import java.util.function.Supplier;

/**
 * CSRF handler for a single-page app (React) using the XSRF-TOKEN cookie.
 * - Token supplied in a header (X-XSRF-TOKEN, copied from the cookie by axios): compared as-is.
 * - Token supplied in a request parameter (e.g. a form): must be the XOR-masked (BREACH-safe) value.
 */
public final class SpaCsrfTokenRequestHandler implements CsrfTokenRequestHandler {

    private final CsrfTokenRequestHandler plain = new CsrfTokenRequestAttributeHandler();
    private final CsrfTokenRequestHandler xor = new XorCsrfTokenRequestAttributeHandler();

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       Supplier<CsrfToken> csrfToken) {
        this.xor.handle(request, response, csrfToken);

        // Force creation of the deferred token so the XSRF-TOKEN cookie is always written.
        csrfToken.get();
    }

    @Override
    public String resolveCsrfTokenValue(HttpServletRequest request, CsrfToken csrfToken) {
        String headerValue = request.getHeader(csrfToken.getHeaderName());

        if (StringUtils.hasText(headerValue)) {
            return this.plain.resolveCsrfTokenValue(request, csrfToken);
        }

        return this.xor.resolveCsrfTokenValue(request, csrfToken);
    }
}
