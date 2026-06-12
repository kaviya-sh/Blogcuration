package com.curation.monitoring;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlertService {

    private final JavaMailSender mailSender;

    @Value("${admin.email}")
    private String adminEmail;

    public void sendPipelineOffAlert() {
        send("ALERT: Article Curation Pipeline is OFF",
                "The pipeline control flag is set to OFF. No articles will be published until the flag is changed to ON.");
    }

    public void sendThemeFailureAlert(String themeId, String reason) {
        send("ALERT: Pipeline failure for theme '" + themeId + "'",
                "Theme processing failed.\nTheme: " + themeId + "\nReason: " + reason);
    }

    public void sendCalibrationCompleteAlert(String themeId) {
        send("INFO: Theme calibration complete for '" + themeId + "'",
                "Weekly editorial profile calibration completed for theme: " + themeId);
    }

    private void send(String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(adminEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Alert sent: {}", subject);
        } catch (Exception e) {
            log.error("Failed to send alert '{}': {}", subject, e.getMessage());
        }
    }
}
