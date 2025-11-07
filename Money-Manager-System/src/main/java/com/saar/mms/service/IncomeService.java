package com.saar.mms.service;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.saar.mms.dto.ExpenseDto;
import com.saar.mms.dto.IncomeDto;
import com.saar.mms.entity.CategoryEntity;
import com.saar.mms.entity.ExpenseEntity;
import com.saar.mms.entity.IncomeEntity;
import com.saar.mms.entity.ProfileEntity;
import com.saar.mms.repository.CategoryRepository;
import com.saar.mms.repository.IncomeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IncomeService {
	private final CategoryService categoryService;
	private final IncomeRepository incomeRepository;
	private final ProfileService profileService;
	private final CategoryRepository categoryRepository;
	
	
	public IncomeDto addIncome(IncomeDto dto) {
		ProfileEntity profile=profileService.getCurrentProfile();
		CategoryEntity category=categoryRepository.findById(dto.getCategoryId())
				.orElseThrow(()-> new RuntimeException("Category not found"));
		IncomeEntity newExpense=dtoToEntity(dto, profile, category);
		newExpense= incomeRepository.save(newExpense);
		return entityToDto(newExpense);
	}
	
	
	// Retrieves all Income for the current month/based on the start date and endDate
		public List<IncomeDto> getCurrentMonthIncomesForCurrentUser()
		{
			ProfileEntity profileEntity=profileService.getCurrentProfile();
			LocalDate now = LocalDate.now();
			LocalDate startDate=now.withDayOfMonth(1);
			LocalDate endDate=now.withDayOfMonth(now.lengthOfMonth());
			List<IncomeEntity> list= incomeRepository.findByProfile_IdAndDateBetween(profileEntity.getId(), startDate, endDate);
			return list.stream().map(this::entityToDto).toList();
		}
	
	
	
		// Delete income  by id for current User
		public void deleteIncome(Long incomeId)
		{
			ProfileEntity profileEntity=profileService.getCurrentProfile();
			IncomeEntity entity= incomeRepository.findById(incomeId).orElseThrow(()-> new RuntimeException("Income not found"));
			if(!entity.getProfile().getId().equals(profileEntity.getId()))
			{
				throw new RuntimeException("Unauthorized to delete this Income");
			}
			else {
				incomeRepository.delete(entity);
			}
		}
		
		// Get latest 5 Income for current user
		public List<IncomeDto> getLast5IncomesForCurrentUser(){
			ProfileEntity profileEntity=profileService.getCurrentProfile();
			List<IncomeEntity> list=incomeRepository.findTop5ByProfile_IdOrderByDateDesc(profileEntity.getId());
			return list.stream().map(this:: entityToDto).toList();
		}
		
		// Get total Income for current user
			public BigDecimal getTotalIncomesForCurrentUser(){
				ProfileEntity profileEntity=profileService.getCurrentProfile();
				BigDecimal total= incomeRepository.findTotalIncomeByProfileId(profileEntity.getId());
				return total != null ? total:BigDecimal.ZERO;
			}
		
		
			
			
			// filter Incomes
			public List<IncomeDto> filterIncomes(LocalDate startDate, LocalDate endDate, String keyword, Sort sort) {

			    // Get current user's profile
			    ProfileEntity profileEntity = profileService.getCurrentProfile();

			    // Fetch filtered expenses from repository
			    List<IncomeEntity> list = incomeRepository
			            .findByProfile_IdAndDateBetweenAndNameContainingIgnoreCase(
			                    profileEntity.getId(), startDate, endDate, keyword, sort);

			    // Convert entities → DTOs and return
			    return list.stream().map(this::entityToDto).toList();
			}

			
	private IncomeEntity dtoToEntity(IncomeDto dto, ProfileEntity profile, CategoryEntity category)
	{
		return IncomeEntity.builder()
		.name(dto.getName())
		.icon(dto.getIcon())
		.amount(dto.getAmount())
		.date(dto.getDate())
		.profile(profile)
		.category(category)
		.build();
	}
	
	private IncomeDto entityToDto(IncomeEntity entity)
	{
		return IncomeDto.builder()
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
