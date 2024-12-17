package com.nodewars.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.nodewars.dto.SignUpRequestDto;
import com.nodewars.service.CognitoService;
import com.nodewars.service.UserService;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private CognitoService cognitoService;

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody SignUpRequestDto request) {
        // Sign up the user using Cognito
        String userSub = cognitoService.signUp(request.getUsername(), request.getEmail(), request.getPassword());

        // Create a new user object and save it to the database
        userService.createUser(request.getEmail(), userSub, request.getUsername(), request.getPassword());

        return ResponseEntity.ok("User created with ID: " + userSub);
    }
}
