package com.saar.mms.service;

import org.springframework.stereotype.Service;

import com.saar.mms.dto.ExpenseDto;
import com.saar.mms.entity.CategoryEntity;
import com.saar.mms.entity.ExpenseEntity;
import com.saar.mms.entity.ProfileEntity;
import com.saar.mms.repository.CategoryRepository;
import com.saar.mms.repository.ExpenseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseService {
	private final CategoryService categoryService;
	private final ExpenseRepository expenseRepository;
	private final ProfileService profileService;
	private final CategoryRepository categoryRepository;
	
	
	public ExpenseDto addExpense(ExpenseDto dto) {
		ProfileEntity profile=profileService.getCurrentProfile();
		CategoryEntity category=categoryRepository.findById(dto.getCategoryId())
				.orElseThrow(()-> new RuntimeException("Category not found"));
		ExpenseEntity newExpense=dtoToEntity(dto, profile, category);
		newExpense= expenseRepository.save(newExpense);
		return entityToDto(newExpense);
	}
	
	
	
	private ExpenseEntity dtoToEntity(ExpenseDto dto, ProfileEntity profile, CategoryEntity category)
	{
		return ExpenseEntity.builder()
						.name(dto.getName())
						.icon(dto.getIcon())
						.amount(dto.getAmount())
						.date(dto.getDate())
						.profile(profile)
						.category(category)
						.build();
	}
	
	private ExpenseDto entityToDto(ExpenseEntity entity)
	{
		return ExpenseDto.builder()
				.id(entity.getId())
				.name(entity.getName())
				.icon(entity.getIcon())
				.categoryId(entity.getCategory()!=null?entity.getCategory().getId():null)
				.categoryName(entity.getCategory()!=null?entity.getCategory().getName():"N/A")
				.amount(entity.getAmount())
				.date(entity.getDate())
				.createdAt(entity.getCreatedAt())
				.updatedAt(entity.getUpdatedAt())
				.build();
	}
}
