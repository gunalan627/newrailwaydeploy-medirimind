package com.medicine.reminder.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> home() {
        return Map.of(
            "status", "UP",
            "service", "Medicine Reminder System",
            "message", "Backend is running successfully 🚀"
        );
    }
}