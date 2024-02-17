package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import ru.kata.spring.boot_security.demo.model.Gender;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final UserService userService;

    @Autowired
    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ModelAndView getPage() {
        var modelAndView = new ModelAndView();
        modelAndView.setViewName("users.html");
        return modelAndView;
    }

    @GetMapping
    public List<User> index() {
        return userService.findAll();
    }

    @PostMapping
    public void add(@RequestBody User user) {
        userService.save(user);
    }

    @PatchMapping("/{id}")
    public void update(@ModelAttribute User user) {
        userService.update(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        userService.delete(id);
    }

    @GetMapping("/getPossibleGenders")
    public List<Gender> getPossibleGenders() {
        return List.of(Gender.values());
    }

    @GetMapping("/getPossibleRoles")
    public List<Role> getPossibleRoles() {
        return List.of(Role.values());
    }
}
