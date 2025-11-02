package com.saar.mms.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="tbl_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	private String fullName;
	
	@Column(unique = true) //Ensures each email in the database is unique (no duplicates allowed)
	private String email;
	private String password;
	private String profileImageUrl;
	
	@Column(updatable = false) //Database column that cannot be changed after creation
	@CreationTimestamp //Automatically stores the date & time when the record is first created
	private LocalDateTime createdAt;
	
	@UpdateTimestamp //Automatically updates the date & time whenever the record is modified
	private LocalDateTime updatedAt;

	private Boolean isActive;
	private String activationToken;
	
	@PrePersist // Runs only once before the entity is saved for the first time; sets isActive to false if not already initialized.
	public void prePersist() 
	{
	    if(this.isActive == null) 
	    {
	        isActive = false;
	    }
	}
}