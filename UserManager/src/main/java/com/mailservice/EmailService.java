package com.mailservice;

public interface EmailService {
    void sendSimpleMessage(String to, String subject, String text);
}
