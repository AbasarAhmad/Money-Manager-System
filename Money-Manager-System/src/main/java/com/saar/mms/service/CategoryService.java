package com.saar.mms.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.saar.mms.dto.CategoryDto;
import com.saar.mms.entity.CategoryEntity;
import com.saar.mms.entity.ProfileEntity;
import com.saar.mms.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor // Lombok generates a constructor for all 'final' fields
public class CategoryService {

    // Inject required dependencies
    private final ProfileService profileService;
    private final CategoryRepository categoryRepository;

    // ==========================
    // Save a new category
    // ==========================
    public CategoryDto saveCategory(CategoryDto categoryDto) {

        // 1. Get the current logged-in user profile
        ProfileEntity profileEntity = profileService.getCurrentProfile();

        // 2. Check if a category with the same name already exists for this profile
        if (categoryRepository.existsByNameAndProfileEntity_Id(categoryDto.getName(), profileEntity.getId())) {
            throw new RuntimeException("Category with this name already exists");
        }

        // 3. Convert DTO → Entity
        CategoryEntity newCategory = dtoToEntity(categoryDto, profileEntity);

        // 4. Save category in DB
        newCategory = categoryRepository.save(newCategory);

        // 5. Convert Entity → DTO and return
        return entityToDto(newCategory);
    }

    // ==========================
    // Helper: Convert DTO to Entity
    // ==========================
    private CategoryEntity dtoToEntity(CategoryDto categoryDto, ProfileEntity profileEntity) {
        return CategoryEntity.builder()
                .name(categoryDto.getName())
                .icon(categoryDto.getIcon())
                .type(categoryDto.getType())
                .profileEntity(profileEntity)
                .build();
    }

    // ==========================
    // Helper: Convert Entity to DTO
    // ==========================
    private CategoryDto entityToDto(CategoryEntity categoryEntity) {
        return CategoryDto.builder()
                .id(categoryEntity.getId())
                .profileId(categoryEntity.getProfileEntity() != null ? categoryEntity.getProfileEntity().getId() : null)
                .name(categoryEntity.getName()) // fixed: was mistakenly setting icon to name
                .icon(categoryEntity.getIcon())
                .type(categoryEntity.getType())
                .createdAt(categoryEntity.getCreatedAt())
                .updatedAt(categoryEntity.getUpdatedAt())
                .build();
    }
}
