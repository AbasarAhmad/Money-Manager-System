package com.saar.mms.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.saar.mms.entity.IncomeEntity;

public interface IncomeRepository extends JpaRepository<IncomeEntity, Long> {

    // -----------------------------------------------------------
    // 🧾 Get all incomes ordered by latest date
    // SQL → SELECT * FROM tbl_income WHERE profile_id = ? ORDER BY date DESC
    // -----------------------------------------------------------
    List<IncomeEntity> findByProfile_IdOrderByDateDesc(Long profileId);

    // -----------------------------------------------------------
    // 🧾 Get top 5 latest incomes
    // SQL → SELECT * FROM tbl_income WHERE profile_id = ? ORDER BY date DESC LIMIT 5
    // -----------------------------------------------------------
    List<IncomeEntity> findTop5ByProfile_IdOrderByDateDesc(Long profileId);

    // -----------------------------------------------------------
    // 💰 Total income for a user
    // JPQL → SELECT COALESCE(SUM(i.amount), 0) FROM IncomeEntity i WHERE i.profile.id = :profileId
    // SQL  → SELECT COALESCE(SUM(amount), 0) FROM tbl_income WHERE profile_id = ?
    // -----------------------------------------------------------
    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM IncomeEntity i WHERE i.profile.id = :profileId")
    BigDecimal findTotalIncomeByProfileId(@Param("profileId") Long profileId);

    // -----------------------------------------------------------
    // 🔍 Search incomes between two dates with keyword filter
    // SQL → SELECT * FROM tbl_income 
    //        WHERE profile_id = ? AND date BETWEEN ? AND ? AND name LIKE %?%
    // -----------------------------------------------------------
    List<IncomeEntity> findByProfile_IdAndDateBetweenAndNameContainingIgnoreCase(
            Long profileId,
            LocalDate startDate,
            LocalDate endDate,
            String keyword,
            Sort sort
    );

    // -----------------------------------------------------------
    // 📆 Get all incomes between two dates
    // SQL → SELECT * FROM tbl_income WHERE profile_id = ? AND date BETWEEN ? AND ?
    // -----------------------------------------------------------
    List<IncomeEntity> findByProfile_IdAndDateBetween(
            Long profileId,
            LocalDate startDate,
            LocalDate endDate
    );
}
