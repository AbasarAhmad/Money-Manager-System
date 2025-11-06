package com.saar.mms.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saar.mms.entity.CategoryEntity;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {

    // Select * from tbl_categories where profile_id = ?1
    List<CategoryEntity> findByProfileEntity_Id(Long profileId);

    // Select * from tbl_categories where id = ?1 and profile_id = ?2
    Optional<CategoryEntity> findByIdAndProfileEntity_Id(Long id, Long profileId);

    // Select * from tbl_categories where type = ?1 and profile_id = ?2
    List<CategoryEntity> findByTypeAndProfileEntity_Id(String type, Long profileId);

    // Check if a category with given name and profile_id exists
    Boolean existsByNameAndProfileEntity_Id(String name, Long profileId);
}
