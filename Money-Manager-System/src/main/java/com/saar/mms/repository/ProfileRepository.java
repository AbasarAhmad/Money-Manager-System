package com.saar.mms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saar.mms.entity.ProfileEntity;

public interface ProfileRepository extends JpaRepository<ProfileEntity, Long> {
    
	// Select * from tb_profiles where email=?
    Optional<ProfileEntity> findByEmail(String email);
    
    // select * from tbl_profiles where activation_token=?
    Optional<ProfileEntity> findByActivationToken(String activationToken);
}
