package com.saar.mms.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.saar.mms.dto.AuthDto;
import com.saar.mms.dto.ProfileDto;
import com.saar.mms.service.ProfileService;

import lombok.RequiredArgsConstructor;



@RestController
@RequiredArgsConstructor
@RequestMapping("/profile")
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping("/register")
    public ResponseEntity<ProfileDto> registerProfile(@RequestBody ProfileDto profileDto) {
    	System.out.println("=================1=============");
        ProfileDto registeredProfile = profileService.registerProfile(profileDto);
        System.out.println("=================2=============");
        return ResponseEntity.status(HttpStatus.CREATED).body(registeredProfile);
    }
    
    @GetMapping("/activate")
    public ResponseEntity<String>activateProfile(@RequestParam String token)
    {
    	System.out.println("===========>>>>>>>>"+token);
    	boolean isActivated=profileService.activateProfile(token);
    	if(isActivated)
    	{
    		return ResponseEntity.ok("Profile activated successfully");
    	}
    	else 
    	{
    		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Avtivation token not found or already used");
    	}
    }
    
    @PostMapping("/login") // Handles user login requests
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthDto authDto) {
        try {
            // Step 1: Check if the user account is active
        	
            // If the account is not activated (is_active = false), return 403 Forbidden
            if (!profileService.isAccountActive(authDto.getEmail())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Account is not active. Please activate your account first."));
            }

            // Step 2: Authenticate the user and generate JWT token
            // If the email and password are correct, a token and user info will be returned
            Map<String, Object> response = profileService.authenticateAndGenerateToken(authDto);

            // Step 3: Return 200 OK with token and user details
            return ResponseEntity.ok(response);
        } 
        catch (Exception e) {
            // Step 4: If authentication fails (invalid credentials, etc.), return 400 Bad Request
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    
}
