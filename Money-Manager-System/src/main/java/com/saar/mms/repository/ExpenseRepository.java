package com.saar.mms.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.saar.mms.entity.ExpenseEntity;

public interface ExpenseRepository extends JpaRepository<ExpenseEntity, Long> {

    // -----------------------------------------------------------
    // 🧩 Get all expenses for a user ordered by latest date
    // SQL → SELECT * FROM tbl_expense WHERE profile_id = ? ORDER BY date DESC
    // -----------------------------------------------------------
    List<ExpenseEntity> findByProfile_IdOrderByDateDesc(Long profileId);

    // -----------------------------------------------------------
    // 🧩 Get top 5 latest expenses for a user
    // SQL → SELECT * FROM tbl_expense WHERE profile_id = ? ORDER BY date DESC LIMIT 5
    // -----------------------------------------------------------
    List<ExpenseEntity> findTop5ByProfile_IdOrderByDateDesc(Long profileId);

    // -----------------------------------------------------------
    // 💰 Get total expense amount for a specific user
    // JPQL → SELECT COALESCE(SUM(e.amount), 0) FROM ExpenseEntity e WHERE e.profile.id = :profileId
    // SQL  → SELECT COALESCE(SUM(amount), 0) FROM tbl_expense WHERE profile_id = ?
    // -----------------------------------------------------------
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM ExpenseEntity e WHERE e.profile.id = :profileId")
    BigDecimal findTotalExpenseByProfileId(@Param("profileId") Long profileId);

    // -----------------------------------------------------------
    // 🔍 Search expenses between two dates and filter by name keyword
    // SQL → SELECT * FROM tbl_expense 
    //        WHERE profile_id = ? AND date BETWEEN ? AND ? AND name LIKE %?%
    // -----------------------------------------------------------
    List<ExpenseEntity> findByProfile_IdAndDateBetweenAndNameContainingIgnoreCase(
            Long profileId,
            LocalDate startDate,
            LocalDate endDate,
            String keyword
    );

    // -----------------------------------------------------------
    // 📆 Get all expenses between two dates for a specific user
    // SQL → SELECT * FROM tbl_expense WHERE profile_id = ? AND date BETWEEN ? AND ?
    // -----------------------------------------------------------
    List<ExpenseEntity> findByProfile_IdAndDateBetween(
            Long profileId,
            LocalDate startDate,
            LocalDate endDate
    );
}
