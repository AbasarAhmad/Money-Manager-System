package com.saar.mms.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saar.mms.entity.ProfileEntity;
import com.saar.mms.service.EmailService;
import com.saar.mms.service.ExcelService;
import com.saar.mms.service.ExpenseService;
import com.saar.mms.service.IncomeService;
import com.saar.mms.service.ProfileService;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class EmailController {

    // Inject required services
    private final ExcelService excelService;
    private final IncomeService incomeService;
    private final ExpenseService expenseService;
    private final EmailService emailService;
    private final ProfileService profileService; // FIXED: Must be final to auto-inject

    // ============================================================
    // 📌 SEND INCOME EXCEL TO USER EMAIL
    // URL → GET /email/income-excel
    // ============================================================
    @GetMapping("/income-excel")
    public ResponseEntity<Void> emailIncomeExcel() throws IOException, MessagingException {

        // Step 1: Get logged-in user's profile (email address)
        ProfileEntity profile = profileService.getCurrentProfile();

        // Step 2: Create an in-memory Excel file
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // Step 3: Write all current-month incomes into the Excel
        excelService.writeIncomeToExcel(
                baos,
                incomeService.getCurrentMonthIncomesForCurrentUser()
        );

        // Step 4: Email Excel file as an attachment
        emailService.sendEmailWithAttachment(
                profile.getEmail(),                      // recipient
                "Your Monthly Income Report",           // email subject
                "Please find attached your income report for this month.", // email body
                baos.toByteArray(),                     // attachment bytes
                "income.xlsx"                            // attachment file name
        );

        // Step 5: Return HTTP 200 OK
        return ResponseEntity.ok().build();
    }

    // ============================================================
    // 📌 SEND EXPENSE EXCEL TO USER EMAIL
    // URL → GET /email/expense-excel
    // ============================================================
    @GetMapping("/expense-excel")
    public ResponseEntity<Void> emailExpenseExcel() throws IOException, MessagingException {

        // Step 1: Get current user profile
        ProfileEntity profile = profileService.getCurrentProfile();

        // Step 2: Create Excel file in memory
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // Step 3: Write current-month expenses into Excel
        excelService.writeExpensesToExcel(
                baos,
                expenseService.getCurrentMonthExpensesForCurrentUser()
        );

        // Step 4: Email Excel as attachment
        emailService.sendEmailWithAttachment(
                profile.getEmail(),
                "Your Monthly Expense Report",
                "Please find attached your expense report for this month.",
                baos.toByteArray(),
                "expenses.xlsx"
        );

        // Step 5: Return success response
        return ResponseEntity.ok().build();
    }
}
