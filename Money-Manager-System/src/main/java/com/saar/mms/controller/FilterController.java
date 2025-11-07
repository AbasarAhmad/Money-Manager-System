package com.saar.mms.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saar.mms.dto.ExpenseDto;
import com.saar.mms.dto.IncomeDto;
import com.saar.mms.dto.filterDto;
import com.saar.mms.service.ExpenseService;
import com.saar.mms.service.IncomeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/filter")
public class FilterController {

    private final ExpenseService expenseService;
    private final IncomeService incomeService;

    /**
     * 📅 Filter transactions (income or expense) based on date range, keyword, and sort order.
     * 
     * Example:
     * POST /filter/filter
     * {
     *   "type": "income",
     *   "startDate": "2025-01-01",
     *   "endDate": "2025-12-31",
     *   "keyword": "salary",
     *   "sortField": "date",
     *   "sortOrder": "desc"
     * }
     */
    @PostMapping("/filter")
    public ResponseEntity<?> filterTransaction(@RequestBody filterDto filterDto) {

        // 🕒 Default start date = very old (if not provided)
        LocalDate startDate = filterDto.getStartDate() != null ? filterDto.getStartDate() : LocalDate.MIN;

        // 🕒 Default end date = today (if not provided)
        LocalDate endDate = filterDto.getEndDate() != null ? filterDto.getEndDate() : LocalDate.now();

        // 🔍 Keyword for searching by name (default empty string)
        String keyword = filterDto.getKeyword() != null ? filterDto.getKeyword() : "";

        // 🧭 Field to sort by (default is "date")
        String sortField = filterDto.getSortField() != null ? filterDto.getSortField() : "date";

        // ⬇️ Sort order: "desc" or "asc" (default is ascending)
        Sort.Direction direction = "desc".equalsIgnoreCase(filterDto.getSortOrder())
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        // ⚙️ Create Sort object dynamically
        Sort sort = Sort.by(direction, sortField);

        // ✅ If user requested "income" type
        if ("income".equalsIgnoreCase(filterDto.getType())) {
            List<IncomeDto> incomes = incomeService.filterIncomes(startDate, endDate, keyword, sort);
            return ResponseEntity.ok(incomes);
        }

        // ✅ If user requested "expense" type
        else if ("expense".equalsIgnoreCase(filterDto.getType())) {
            List<ExpenseDto> expenses = expenseService.filterExpenses(startDate, endDate, keyword, sort);
            return ResponseEntity.ok(expenses);
        }

        // ❌ If type is invalid, return bad request
        else {
            return ResponseEntity.badRequest()
                    .body("Invalid type. Must be 'income' or 'expense'");
        }
    }
}
