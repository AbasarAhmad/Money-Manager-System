package com.saar.mms.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saar.mms.dto.CategoryDto;
import com.saar.mms.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/category")
public class CategoryController {

	private final CategoryService categoryService;
	
	@PostMapping("/add")
	public ResponseEntity<CategoryDto> saveCategoryDto(@RequestBody CategoryDto categoryDto)
	{
		CategoryDto savedCategory=categoryService.saveCategory(categoryDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
	}
}
