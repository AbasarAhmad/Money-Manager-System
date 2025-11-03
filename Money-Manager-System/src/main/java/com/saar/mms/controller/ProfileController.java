package com.saar.mms.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String>activateProfile(@RequestParam String token){
    	System.out.println("===========>>>>>>>>"+token);
    	boolean isActivated=profileService.activateProfile(token);
    	if(isActivated)
    	{
    		return ResponseEntity.ok("Profile activated successfully");
    	}
    	else {
    		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Avtivation token not found or already used");
    	}
    }
}
