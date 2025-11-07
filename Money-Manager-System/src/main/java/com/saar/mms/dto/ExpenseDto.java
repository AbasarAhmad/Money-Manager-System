package com.saar.mms.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExpenseDto {
	private Long id;
	private String name;
	private String icon ;
	private Long categoryId;
	private String categoryName;
	private BigDecimal amount;
	private LocalDate date;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
