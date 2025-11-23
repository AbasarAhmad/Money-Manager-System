package com.saar.mms.controller;

import java.io.IOException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saar.mms.service.ExcelService;
import com.saar.mms.service.ExpenseService;
import com.saar.mms.service.IncomeService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/excel")
@RequiredArgsConstructor
public class ExcelController {

    private final ExcelService excelService;
    private final IncomeService incomeService;   // FIXED: Add final
    private final ExpenseService expenseService; // FIXED: Add final

    // ------------------------ DOWNLOAD INCOME EXCEL ------------------------
    @GetMapping("/download/income")
    public void downloadIncomeExcel(HttpServletResponse response) throws IOException {

        // FIXED: correct content type
        response.setContentType(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        response.setHeader(
                "Content-Disposition",
                "attachment; filename=income.xlsx"
        );

        excelService.writeIncomeToExcel(
                response.getOutputStream(),
                incomeService.getCurrentMonthIncomesForCurrentUser() // FIXED
        );
    }

    // ------------------------ DOWNLOAD EXPENSE EXCEL ------------------------
    @GetMapping("/download/expense")
    public void downloadExpenseExcel(HttpServletResponse response) throws IOException {

        // FIXED: correct content type
        response.setContentType(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        response.setHeader(
                "Content-Disposition",
                "attachment; filename=expense.xlsx"
        );

        excelService.writeExpensesToExcel(
                response.getOutputStream(),
                expenseService.getCurrentMonthExpensesForCurrentUser() // FIXED
        );
    }
}
