package com.saar.mms.dto;

import java.time.LocalDateTime;

import com.saar.mms.entity.ProfileEntity;


import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDto {
	
	private Long id;
	private Long profileId;
	private String name;
	private String icon;
	private String type;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="profile_id", nullable = false)
	private ProfileEntity profileEntity;

}
