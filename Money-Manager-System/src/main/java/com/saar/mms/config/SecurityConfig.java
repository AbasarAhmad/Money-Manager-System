package com.saar.mms.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.saar.mms.security.JwtRequestFilter;
import com.saar.mms.service.AppUserDetailsService;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    // Inject custom user details service and JWT filter
    private final AppUserDetailsService appUserDetailsService;
    private final JwtRequestFilter jwtRequestFilter;

    // ==========================
    // Main Security Configuration
    // ==========================
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Enable CORS for cross-origin requests (frontend access)
            .cors(Customizer.withDefaults())

            // Disable CSRF (not needed for REST APIs)
            .csrf(AbstractHttpConfigurer::disable)

            // Configure public and protected endpoints
            .authorizeHttpRequests(auth -> auth
            		.requestMatchers(
            			    "/profile/register",
            			    "/profile/activate",
            			    "/profile/login",
            			    "/category/**",     // add this line for now
            			    "/status",
            			    "/health"
            			).permitAll()             // allow these without authentication
                .anyRequest().authenticated() // all other requests require JWT
            )

            // Disable session creation — JWT is stateless
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Add JWT filter before Spring Security's built-in auth filter
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)

            // Use our custom user details service for authentication
            .userDetailsService(appUserDetailsService);

        // Build and return the configured security filter chain
        return http.build();
    }

    // ==========================
    // Password Encoder
    // ==========================
    @Bean
    public PasswordEncoder passwordEncoder() {
        // Use BCrypt for password hashing (recommended)
        return new BCryptPasswordEncoder();
    }

    // ==========================
    // Authentication Manager
    // ==========================
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        // Provides AuthenticationManager bean used in ProfileService
        return config.getAuthenticationManager();
    }

    // ==========================
    // DAO Authentication Provider
    // ==========================
    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        // This provider tells Spring Security how to authenticate using DB-stored users
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(appUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    // ==========================
    // CORS Configuration
    // ==========================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // Define CORS rules (what origins, headers, methods are allowed)
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*")); // Allow all origins (you can restrict later)
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true); // Allow sending credentials (like JWT tokens)

        // Apply CORS configuration globally
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
