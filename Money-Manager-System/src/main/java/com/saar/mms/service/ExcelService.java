package com.saar.mms.service;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.stream.IntStream;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.saar.mms.dto.ExpenseDto;
import com.saar.mms.dto.IncomeDto;


@Service
public class ExcelService {

    // =====================================================================
    // 📌 INCOME EXPORT TO EXCEL
    // =====================================================================
    public void writeIncomeToExcel(OutputStream os, List<IncomeDto> incomes) throws IOException {

        // Excel workbook bana rahe hain
        try (Workbook workbook = new XSSFWorkbook()) {

            // Sheet bana rahe hain (Income sheet)
            Sheet sheet = workbook.createSheet("Income");

            // ---------------- HEADER ROW ----------------
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("S.No");
            header.createCell(1).setCellValue("Name");
            header.createCell(2).setCellValue("Category");
            header.createCell(3).setCellValue("Amount");
            header.createCell(4).setCellValue("Date");

            // ---------------- DATA ROWS ----------------
            IntStream.range(0, incomes.size()).forEach(i -> {

                IncomeDto income = incomes.get(i);

                // Excel row (1 se start because 0 pe header hai)
                Row row = sheet.createRow(i + 1);

                // S.No
                row.createCell(0).setCellValue(i + 1);

                // Name
                row.createCell(1).setCellValue(
                        income.getName() != null ? income.getName() : "N/A"
                );

                // Category
                row.createCell(2).setCellValue(
                        income.getCategoryName() != null ? income.getCategoryName() : "N/A"
                );

                // Amount
                row.createCell(3).setCellValue(
                        income.getAmount() != null ? income.getAmount().doubleValue() : 0
                );

                // Date (string format)
                row.createCell(4).setCellValue(
                        income.getDate() != null ? income.getDate().toString() : "N/A"
                );

            });

            // Excel file ko OutputStream me save karna
            workbook.write(os);
        }
    }

    // =====================================================================
    // 📌 EXPENSE EXPORT TO EXCEL
    // =====================================================================
    public void writeExpensesToExcel(OutputStream os, List<ExpenseDto> expenses) throws IOException {

        // Excel workbook
        try (Workbook workbook = new XSSFWorkbook()) {

            Sheet sheet = workbook.createSheet("Expenses");

            // ---------------- HEADER ----------------
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("S.No");
            header.createCell(1).setCellValue("Name");
            header.createCell(2).setCellValue("Category");
            header.createCell(3).setCellValue("Amount");
            header.createCell(4).setCellValue("Date");

            // ---------------- DATA ROWS ----------------
            IntStream.range(0, expenses.size()).forEach(i -> {

                ExpenseDto expense = expenses.get(i);
                Row row = sheet.createRow(i + 1);

                row.createCell(0).setCellValue(i + 1);

                row.createCell(1).setCellValue(
                        expense.getName() != null ? expense.getName() : "N/A"
                );

                row.createCell(2).setCellValue(
                        expense.getCategoryName() != null ? expense.getCategoryName() : "N/A"
                );

                row.createCell(3).setCellValue(
                        expense.getAmount() != null ? expense.getAmount().doubleValue() : 0
                );

                row.createCell(4).setCellValue(
                        expense.getDate() != null ? expense.getDate().toString() : "N/A"
                );

            });

            workbook.write(os);
        }
    }
}
