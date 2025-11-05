package com.saar.mms.service;

import java.util.Collections;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.saar.mms.entity.ProfileEntity;
import com.saar.mms.repository.ProfileRepository;

import lombok.RequiredArgsConstructor;

@Service  // Marks this as a service class for Spring
@RequiredArgsConstructor  // Automatically creates a constructor for final fields
public class AppUserDetailsService implements UserDetailsService {

    // Injects the ProfileRepository to fetch users from the database
    private final ProfileRepository profileRepository;

    /**
     * This method is automatically called by Spring Security
     * when a user tries to log in.
     * 
     * It looks up the user by email and returns a UserDetails object
     * (which Spring Security uses to handle authentication).
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        
        //Find the user in the database using their email
        ProfileEntity existingProfile = profileRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Profile not found with email: " + email));

        // Convert your ProfileEntity to a Spring Security User object
        // Here we pass: username, encrypted password, and user roles (empty for now)
        return User.builder()
                .username(existingProfile.getEmail())       // username = email
                .password(existingProfile.getPassword())   // encoded password
                .authorities(Collections.emptyList())      // no roles yet
                .build();
    }
}
