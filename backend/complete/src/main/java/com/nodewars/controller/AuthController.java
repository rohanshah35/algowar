package com.nodewars.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nodewars.dto.LoginRequestDto;
import com.nodewars.dto.SignUpRequestDto;
import com.nodewars.dto.VerificationRequestDto;
import com.nodewars.service.CognitoService;
import com.nodewars.service.UserService;

/**
 * AuthController handles authentication-related requests such as user signup, login, and email verification.
 * It uses UserService for user management and CognitoService for interacting with AWS Cognito.
 * 
 * Endpoints:
 * - POST /auth/signup: Registers a new user.
 * - POST /auth/login: Authenticates a user and returns an ID token.
 * - POST /auth/verify-email: Verifies a user's email address.
 * 
 * Dependencies:
 * - UserService: Manages user data.
 * - CognitoService: Handles AWS Cognito operations.
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private CognitoService cognitoService;

    /**
     * Registers a new user and saves the user data to the database.
     * @param request the sign-up request containing the user's email, username, and password
     * @return a success message
     */
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody SignUpRequestDto request) {
        // Sign up the user using Cognito
        String userSub = cognitoService.signUp(request.getUsername(), request.getEmail(), request.getPassword());

        // Create a new user object and save it to the database
        userService.createUser(request.getEmail(), userSub, request.getUsername(), request.getPassword());

        return ResponseEntity.ok("User created with ID: " + userSub);
    }

    /**
     * Logs in a user and returns an ID token.
     * @param request the login request containing the username and password
     * @return the ID token of the authenticated user
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDto request) {
        String idToken = cognitoService.login(request.getUsername(), request.getPassword());

        return ResponseEntity.ok(idToken);
    }

    /**
     * Verifies the user's email address using the verification code sent to the user's email.
     * @param request the verification request containing the username and verification code
     * @return a success message
     */
    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestBody VerificationRequestDto request) {
        // Verify the email using Cognito
        cognitoService.verifyEmail(request.getUsername(), request.getVerificationCode());

        return ResponseEntity.ok("Email verified successfully");
    }

    /**
     * Resends the verification code to the user's email address.
     * @param request the verification request containing the username
     * @return a success message
     */
    @PostMapping("/resend-verification-code")
    public ResponseEntity<String> resendVerificationCode(@RequestBody VerificationRequestDto request) {
        // Resend the verification code using Cognito
        cognitoService.resendVerificationCode(request.getUsername());

        return ResponseEntity.ok("Verification code resent successfully");
    }
}
