package com.saar.mms.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.saar.mms.entity.ProfileEntity;
import com.saar.mms.repository.ProfileRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j  //SLF4J is used in Java to write log messages like errors, info, or debug — so developers can understand what the program is doing or if something goes wrong.
public class NotificationService {

    private final ProfileRepository profileRepository;
    private final EmailService emailService;
    private final ExpenseService expenseService; // (currently not used but fine)

    // to connect to fronted part
    @Value("${money.manager.frontend.url}")
    private String frontendUrl;

    /**
     * ✅ Schedules a reminder email to all active users
     * Runs every minute for testing (change to 10 PM later)
     * 
     * Cron "0 * * * * *" = every minute
     * Cron "0 0 22 * * *" = every day at 10 PM
     * 
     * ✅ Fixed zone: use "Asia/Kolkata" instead of invalid "IST"
     */
    @Scheduled(cron = "0 * * * * *", zone = "Asia/Kolkata")
    // @Scheduled(cron = "0 0 22 * * *", zone = "Asia/Kolkata") // uncomment this for production
    public void sendDailyIncomeExpenseReminder() {

        log.info("Job started: sendDailyIncomeExpenseReminder");

        List<ProfileEntity> profiles = profileRepository.findAll();

        for (ProfileEntity profile : profiles) {

            // Skip invalid or inactive profiles
            if (profile == null || profile.getEmail() == null || !profile.getIsActive()) {
                log.warn("Skipping profile (invalid or inactive)");
                continue;
            }

            // Fixed string concatenation & HTML syntax
            String body = "Hi " + profile.getFullName() + ",<br><br>"
                    + "This is a friendly reminder to add your income and expenses for today "
                    + "in Money Manager.<br><br>"
                    + "<a href='" + frontendUrl + "' "
                    + "style='display:inline-block; padding:10px 20px; background-color:#4CAF50; "
                    + "color:#fff; text-decoration:none; border-radius:5px; font-weight:bold;'>"
                    + "Go to Money Manager</a>"
                    + "<br><br>Best regards,<br>Money Manager Team";

            try {
                //  Send email safely
                emailService.sendEmail(profile.getEmail(),
                        "Daily Reminder: Add Your Income & Expenses",
                        body);

                log.info("Reminder email sent to {}", profile.getEmail());
            } catch (Exception e) {
                log.error("Failed to send email to {}: {}", profile.getEmail(), e.getMessage());
            }
        }

        log.info("Job completed: sendDailyIncomeExpenseReminder");
    }
}
