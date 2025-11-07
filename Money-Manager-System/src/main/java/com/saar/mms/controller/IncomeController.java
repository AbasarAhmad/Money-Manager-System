package com.saar.mms.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

}
