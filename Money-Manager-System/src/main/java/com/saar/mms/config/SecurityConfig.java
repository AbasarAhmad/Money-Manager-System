package com.saar.mms.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // ✅ fixed wrong import

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    //  Main security configuration
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity
            // Allow cross-origin requests (for frontend calls)
            .cors(Customizer.withDefaults())

            // Disable CSRF (not needed for APIs)
            .csrf(AbstractHttpConfigurer::disable)

            // Define which endpoints are public
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/profile/register", // anyone can register
                    "/api/profile/activate", // anyone can activate via email
                    "/status",               // health check
                    "/health"                // another health check
                ).permitAll()
                .anyRequest().authenticated() // everything else requires authentication
            )

            // No session creation (stateless = better for REST/JWT)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        // Return final configuration
        return httpSecurity.build();
    }

    // Password encoder for encrypting user passwords
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //  CORS configuration (to allow frontend requests)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(List.of("*")); // allow all origins
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // allowed methods
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept")); // allowed headers
        configuration.setAllowCredentials(true); // allow cookies/auth headers

        //  Correct URL mapping pattern for all paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
