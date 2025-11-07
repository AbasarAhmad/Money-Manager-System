package com.saar.mms.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import com.saar.mms.dto.ExpenseDto;
import com.saar.mms.dto.IncomeDto;
import com.saar.mms.dto.RecentTransactionDto;
import com.saar.mms.entity.ProfileEntity;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    // ✅ Inject all required services
    private final IncomeService incomeService;
    private final ExpenseService expenseService;
    private final ProfileService profileService;

    /**
     * 📊 This method collects all dashboard-related data
     * such as total income, total expense, balance,
     * and last 5 transactions (both income & expense)
     */
    public Map<String, Object> getDashboardData() {

        // 🔹 Get the current logged-in user's profile
        ProfileEntity profile = profileService.getCurrentProfile();

        // 🔹 Create a Map to hold all dashboard response data
        Map<String, Object> returnValue = new LinkedHashMap<>();

        // 🔹 Fetch latest 5 incomes and expenses for the current user
        List<IncomeDto> latestIncomes = incomeService.getLast5IncomesForCurrentUser();
        List<ExpenseDto> latestExpenses = expenseService.getLast5ExpensesForCurrentUser();

        // 🔹 Convert IncomeDto → RecentTransactionDto
        // 🔹 Convert ExpenseDto → RecentTransactionDto
        // 🔹 Merge both lists and sort by date (latest first)
        List<RecentTransactionDto> recentTransactions = Stream.concat(

                // 🔸 Stream of incomes (convert each to RecentTransactionDto)
                latestIncomes.stream().map(income -> RecentTransactionDto.builder()
                        .id(income.getId())
                        .profileId(profile.getId())
                        .icon(income.getIcon())
                        .name(income.getName())
                        .amount(income.getAmount())
                        .date(income.getDate())
                        .createdAt(income.getCreatedAt())
                        .updatedAt(income.getUpdatedAt())
                        .type("income") // Mark as income
                        .build()),

                // 🔸 Stream of expenses (convert each to RecentTransactionDto)
                latestExpenses.stream().map(expense -> RecentTransactionDto.builder()
                        .id(expense.getId())
                        .profileId(profile.getId())
                        .icon(expense.getIcon())
                        .name(expense.getName())
                        .amount(expense.getAmount())
                        .date(expense.getDate())
                        .createdAt(expense.getCreatedAt())
                        .updatedAt(expense.getUpdatedAt())
                        .type("expense") // Mark as expense
                        .build())
        )
        // 🔹 Sort transactions by date (latest first)
        .sorted((a, b) -> {
            // Compare by transaction date (descending)
            int cmp = b.getDate().compareTo(a.getDate());
            // If both have same date, sort by createdAt timestamp
            if (cmp == 0 && a.getCreatedAt() != null && b.getCreatedAt() != null) {
                return b.getCreatedAt().compareTo(a.getCreatedAt());
            }
            return cmp;
        })
        // 🔹 Collect the final list (unmodifiable)
        .collect(Collectors.toUnmodifiableList());

        // 🔹 Add calculated totals and lists to the return map

        // 💰 Total Balance = Total Income - Total Expense
        returnValue.put("totalBalance",
                incomeService.getTotalIncomesForCurrentUser()
                        .subtract(expenseService.getTotalExpenseForCurrentUser()));

        // 💵 Total Incomes
        returnValue.put("totalIncome", incomeService.getTotalIncomesForCurrentUser());

        // 💸 Total Expenses
        returnValue.put("totalExpense", expenseService.getTotalExpenseForCurrentUser());

        // 🧾 Recently added 5 incomes
        returnValue.put("recent5Incomes", latestIncomes);

        // 🧾 Recently added 5 expenses
        returnValue.put("recent5Expenses", latestExpenses);

        // 🔄 Combined recent transactions (both income + expense)
        returnValue.put("recentTransactions", recentTransactions);

        // ✅ Return final dashboard response map
        return returnValue;
    }
}
