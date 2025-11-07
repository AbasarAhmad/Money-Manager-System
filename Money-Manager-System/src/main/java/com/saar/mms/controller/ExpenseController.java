package com.saar.mms.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saar.mms.dto.ExpenseDto;
import com.saar.mms.service.ExpenseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/expense")
public class ExpenseController {
	
	private final ExpenseService expenseService;
	
	@PostMapping("/add")
	public ResponseEntity<ExpenseDto> addExpense(@RequestBody ExpenseDto dto)
	{
		ExpenseDto saved= expenseService.addExpense(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}

}
