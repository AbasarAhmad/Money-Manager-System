package com.saar.mms.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saar.mms.dto.ExpenseDto;
import com.saar.mms.dto.IncomeDto;
import com.saar.mms.service.IncomeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/income")
public class IncomeController {
	
	private final IncomeService incomeService;
	@PostMapping("/add")
	public ResponseEntity<IncomeDto> addIncome(@RequestBody IncomeDto dto)
	{
		IncomeDto saved= incomeService.addIncome(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}
	
	@GetMapping("/get")
	public ResponseEntity<List<IncomeDto>> getAllExpense()
	{
		List<IncomeDto> allExpense= incomeService.getCurrentMonthIncomesForCurrentUser();
		return ResponseEntity.ok(allExpense);
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Void> deleteIncome(@PathVariable Long id)
	{
		incomeService.deleteIncome(id);
		return ResponseEntity.noContent().build();
	}

}
