package com.saar.mms.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.saar.mms.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

    // Inject custom user details service and JWT utility class
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Extract the "Authorization" header from the incoming request
        final String authHeader = request.getHeader("Authorization");
        String email = null;
        String jwt = null;

        // Check if the header starts with "Bearer "
        // Example: "Authorization: Bearer <token>"
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // Remove "Bearer " prefix to get the actual JWT token
            jwt = authHeader.substring(7);
            // Extract username/email from the JWT token
            email = jwtUtil.extractUsername(jwt);
        }

        // Proceed only if:
        // 1. The token contains a username, and
        // 2. The user is not already authenticated in this request
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Load user details (email, password, authorities) from the database
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(email);

            // Validate the token using the username (check if not expired and matches)
            if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                // Create an authentication object with user details and authorities
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                // Attach additional details from the HTTP request (like IP, session info)
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set authentication into the Spring Security context
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Continue the request filter chain (pass request to the next filter)
        filterChain.doFilter(request, response);
    }
}
