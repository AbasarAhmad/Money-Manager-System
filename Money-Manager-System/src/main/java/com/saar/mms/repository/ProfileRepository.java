package com.saar.mms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saar.mms.entity.ProfileEntity;

public interface ProfileRepository extends JpaRepository<ProfileEntity, Long> {
    
    Optional<ProfileEntity> findByEmail(String email);
}
