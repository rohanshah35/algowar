package com.nodewars.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nodewars.dto.LoginRequestDto;
import com.nodewars.dto.SignUpRequestDto;
import com.nodewars.service.CognitoService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final CognitoService cognitoService;

    public AuthController(CognitoService cognitoService) {
        this.cognitoService = cognitoService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody SignUpRequestDto request) {
        String userSub = cognitoService.signUp(request.getUsername(), request.getEmail(), request.getPassword());
        return ResponseEntity.ok("User created with ID: " + userSub);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDto request) {
        String token = cognitoService.login(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(token);
    }
}
