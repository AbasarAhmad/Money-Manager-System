package com.saar.mms.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.saar.mms.dto.ProfileDto;
import com.saar.mms.entity.ProfileEntity;
import com.saar.mms.repository.ProfileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileDto registerProfile(ProfileDto profileDto) {
        ProfileEntity newProfile = dtoToEntity(profileDto);
        newProfile.setActivationToken(UUID.randomUUID().toString());

        newProfile = profileRepository.save(newProfile);
        return entityToDto(newProfile);
    }

    private ProfileEntity dtoToEntity(ProfileDto dto) {
        return ProfileEntity.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .password(dto.getPassword())
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
}
