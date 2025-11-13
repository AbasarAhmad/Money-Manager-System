package com.saar.mms.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.saar.mms.dto.AuthDto;
import com.saar.mms.dto.ProfileDto;
import com.saar.mms.entity.ProfileEntity;
import com.saar.mms.repository.ProfileRepository;
import com.saar.mms.service.ProfileService;

import lombok.RequiredArgsConstructor;



@RestController
@RequiredArgsConstructor
@RequestMapping("/profile")
public class ProfileController {

    private final ProfileService profileService;
    private final PasswordEncoder passwordEncoder;
    private final ProfileRepository profileRepository;
    

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
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthDto authDto) {
        try {
            // Step 1: Find user by email
            ProfileEntity profile = profileRepository
                    .findByEmail(authDto.getEmail().toLowerCase())
                    .orElse(null);

            if (profile == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid username or password, Please check"));
            }

            // Step 2: Validate password
            if (!passwordEncoder.matches(authDto.getPassword(), profile.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid username or password, Please check!"));
            }

            // Step 3: Check activation
            if (!profile.getIsActive()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Account is not active. Please activate your account first."));
            }

            // Step 4: Generate JWT token
            Map<String, Object> response = profileService.authenticateAndGenerateToken(authDto);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }



    
}
