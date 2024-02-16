package ru.kata.spring.boot_security.demo.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.model.User;

@RestController
public class UserController {
    @GetMapping("/user")
    public User getUser() {
        var currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return currentUser;
    }
}
