package com.saar.mms.service;

import java.util.Map;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication; 
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.saar.mms.dto.AuthDto;
import com.saar.mms.dto.ProfileDto;
import com.saar.mms.entity.ProfileEntity;
import com.saar.mms.repository.ProfileRepository;
import com.saar.mms.util.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final EmailService emailService;
    
 // 🔐 Injects the password encoder (we defined it as a @Bean in SecurityConfig)
 // Used to encrypt and verify passwords
 private final PasswordEncoder passwordEncoder;

 // ✅ Injects the AuthenticationManager (also defined as a @Bean)
 // Used to authenticate users during login
 private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    // ==========================
    // Register New Profile
    // ==========================
    public ProfileDto registerProfile(ProfileDto profileDto) {
        ProfileEntity newProfile = dtoToEntity(profileDto);
        newProfile.setActivationToken(UUID.randomUUID().toString());

        // Activation mail
        String activationLink = "http://localhost:8080/api/profile/activate?token=" + newProfile.getActivationToken();
        String subject = "Activate your Money Manager account";
        String body = "Hello " + newProfile.getFullName() + ",\n\n"
                + "Click the link below to activate your account:\n"
                + activationLink + "\n\nThank you!\nMoney Manager Team";

        emailService.sendEmail(newProfile.getEmail(), subject, body);
        newProfile = profileRepository.save(newProfile);
        return entityToDto(newProfile);
    }

    private ProfileEntity dtoToEntity(ProfileDto dto) {
        return ProfileEntity.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail().toLowerCase())
                .password(passwordEncoder.encode(dto.getPassword())) // store encoded password
                .profileImageUrl(dto.getProfileImageUrl())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .build();
    }

    private ProfileDto entityToDto(ProfileEntity entity) {
        return ProfileDto.builder()
                .id(entity.getId())
                .fullName(entity.getFullName())
                .email(entity.getEmail())
                .profileImageUrl(entity.getProfileImageUrl())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

 // ==========================
 // Activate Profile
 // ==========================
 public boolean activateProfile(String activationToken) {
     // Find the user by activation token
     // If found, mark the account as active and save it
     // If not found, return false
     return profileRepository.findByActivationToken(activationToken)
             .map(profile -> {
                 profile.setIsActive(true);
                 profileRepository.save(profile);
                 return true;
             })
             .orElse(false);
 }

 // ==========================
 // Check if Account is Active
 // ==========================
 public boolean isAccountActive(String email) {
     // Check if the user exists and return their 'isActive' status
     // If user not found, return false
     return profileRepository.findByEmail(email.toLowerCase())
             .map(ProfileEntity::getIsActive)
             .orElse(false);
 }

 // ==========================
 // Get Current Logged-In Profile
 // ==========================
 public ProfileEntity getCurrentProfile() {
     // Get authentication details from security context
     Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

     // Find the logged-in user's profile by email
     // If not found, throw an exception
     return profileRepository.findByEmail(authentication.getName().toLowerCase())
             .orElseThrow(() -> new UsernameNotFoundException(
                     "Profile not found with email: " + authentication.getName()));
 }

 // ==========================
 // Get Public Profile (By Email or Current User)
 // ==========================
 public ProfileDto getPublicProfile(String email) {
     ProfileEntity profile;

     // If email is not provided, use current logged-in user's profile
     if (email == null) {
         profile = getCurrentProfile();
     } else {
         // Otherwise, fetch profile by provided email
         profile = profileRepository.findByEmail(email.toLowerCase())
                 .orElseThrow(() -> new UsernameNotFoundException(
                         "Profile not found with email: " + email));
     }

     // Convert the entity to DTO before returning
     return ProfileDto.builder()
             .id(profile.getId())
             .fullName(profile.getFullName())
             .email(profile.getEmail())
             .profileImageUrl(profile.getProfileImageUrl())
             .createdAt(profile.getCreatedAt())
             .updatedAt(profile.getUpdatedAt())
             .build();
 }

 // ==========================
 // Authenticate User and Generate JWT Token
 // ==========================
 public Map<String, Object> authenticateAndGenerateToken(AuthDto authDto) {
     try {
         String email = authDto.getEmail().toLowerCase();

         // Log received login details for debugging
         System.out.println("\n=== DEBUG LOGIN START ===");
         System.out.println("Email received: " + email);
         System.out.println("Password received: " + authDto.getPassword());

         // Check if user exists and print password match status
         profileRepository.findByEmail(email).ifPresentOrElse(
             user -> {
                 System.out.println("User found in DB: " + user.getEmail());
                 System.out.println("Encoded password in DB: " + user.getPassword());
                 System.out.println("BCrypt matches? " +
                         passwordEncoder.matches(authDto.getPassword(), user.getPassword()));
             },
             () -> System.out.println("No user found in DB for " + email)
         );
         System.out.println("=== DEBUG LOGIN END ===\n");

         // Authenticate the user's credentials
         authenticationManager.authenticate(
                 new UsernamePasswordAuthenticationToken(email, authDto.getPassword())
         );

         // If authentication succeeds, generate a JWT token
         String token = jwtUtil.generateToken(email);

         // Return the token and public user profile
         return Map.of(
                 "token", token,
                 "user", getPublicProfile(email)
         );

     } catch (Exception e) {
         // Log the full error for debugging and return a custom error message
         e.printStackTrace();
         throw new RuntimeException("Invalid email or password");
     }
 }

}
