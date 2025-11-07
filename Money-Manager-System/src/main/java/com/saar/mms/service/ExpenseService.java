package com.saar.mms.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
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
	
	
	
	// Retrieves all expenses for the current month/based on the start date and endDate
	public List<ExpenseDto> getCurrentMonthExpensesForCurrentUser()
	{
		ProfileEntity profileEntity=profileService.getCurrentProfile();
		LocalDate now = LocalDate.now();
		LocalDate startDate=now.withDayOfMonth(1);
		LocalDate endDate=now.withDayOfMonth(now.lengthOfMonth());
		List<ExpenseEntity> list= expenseRepository.findByProfile_IdAndDateBetween(profileEntity.getId(), startDate, endDate);
		return list.stream().map(this::entityToDto).toList();
	}
	
	
	
	// Delete expense by id for current User
	public void deleteExpense(Long expenseId)
	{
		ProfileEntity profileEntity=profileService.getCurrentProfile();
		ExpenseEntity entity= expenseRepository.findById(expenseId).orElseThrow(()-> new RuntimeException("Expense not found"));
		if(!entity.getProfile().getId().equals(profileEntity.getId()))
		{
			throw new RuntimeException("Unauthorized to delete this expense");
		}
		else {
			expenseRepository.delete(entity);
		}
	}
	
	
	// Get latest 5 expenses for current user
	public List<ExpenseDto> getLast5ExpensesForCurrentUser(){
		ProfileEntity profileEntity=profileService.getCurrentProfile();
		List<ExpenseEntity> list=expenseRepository.findTop5ByProfile_IdOrderByDateDesc(profileEntity.getId());
		return list.stream().map(this:: entityToDto).toList();
	}
	
	// Get total expense for current user
		public BigDecimal getTotalExpenseForCurrentUser(){
			ProfileEntity profileEntity=profileService.getCurrentProfile();
			BigDecimal total= expenseRepository.findTotalExpenseByProfileId(profileEntity.getId());
			return total != null ? total:BigDecimal.ZERO;
		}
		
		
		// filter expenses
		public List<ExpenseDto> filterExpenses(LocalDate startDate, LocalDate endDate, String keyword, Sort sort) {

		    // Get current user's profile
		    ProfileEntity profileEntity = profileService.getCurrentProfile();

		    // Fetch filtered expenses from repository
		    List<ExpenseEntity> list = expenseRepository
		            .findByProfile_IdAndDateBetweenAndNameContainingIgnoreCase(
		                    profileEntity.getId(), startDate, endDate, keyword, sort);

		    // Convert entities → DTOs and return
		    return list.stream().map(this::entityToDto).toList();
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
