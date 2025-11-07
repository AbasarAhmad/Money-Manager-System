package com.saar.mms.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saar.mms.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/dashboard")
public class DashboardController {
	
	private final DashboardService dashboardService;
	
	@GetMapping("/get")
	public ResponseEntity<Map<String,Object>> getDashboardData()
	{
		Map<String, Object> dashboardData= dashboardService.getDashboardData();
		return ResponseEntity.ok(dashboardData);
	}

}
