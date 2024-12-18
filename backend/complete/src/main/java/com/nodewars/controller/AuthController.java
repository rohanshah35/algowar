package com.nodewars.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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
     * 201 Created is returned if the user is successfully created.
     * 400 Bad Request is returned if an error occurs during user creation.
     * @param request the sign-up request containing the user's email, username, and password
     * @return a success message
     */
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody SignUpRequestDto request) {
        try {
            String userSub = cognitoService.signUp(request.getUsername(), request.getEmail(), request.getPassword());

            userService.createUser(request.getEmail(), userSub, request.getUsername(), request.getPassword());

            return ResponseEntity.status(HttpStatus.CREATED).body("User created with ID: " + userSub);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error occurred during user sign-up: " + e.getMessage());
        }
    }

    /**
     * Logs in a user and returns an ID token.
     * 401 Unauthorized is returned if authentication fails.
     * @param request the login request containing the username and password
     * @return the ID token of the authenticated user
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDto request) {
        try {
            String idToken = cognitoService.login(request.getUsername(), request.getPassword());
            ResponseCookie cookie = ResponseCookie.from("idToken", idToken)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(3600)
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body("{\"message\": \"User logged in successfully. Cookie: " + cookie.toString() + "\"}");
        } catch (Exception e) {
            // Return 401 Unauthorized if authentication fails
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"Authentication failed: " + e.getMessage() + "\"}");
        }
    }

    /**
     * Verifies the user's email address using the verification code sent to the user's email.
     * 400 Bad Request is returned if an error occurs during email verification.
     * @param request the verification request containing the username and verification code
     * @return a success message
     * 
     */
    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestBody VerificationRequestDto request) {
        try {
            cognitoService.verifyEmail(request.getUsername(), request.getVerificationCode());

            String idToken = cognitoService.login(request.getUsername(), request.getPassword());
            ResponseCookie cookie = ResponseCookie.from("idToken", idToken)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(3600)
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body("{\"message\": \"User verified and logged in successfully. Cookie: " + cookie.toString() + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"An error occured during email verification: " + e.getMessage() + "\"}");
        }
    }

    /**
     * Resends the verification code to the user's email address.
     * 400 Bad Request is returned if an error occurs during resending the verification code.
     * @param request the verification request containing the username
     * @return a success message
     */
    @PostMapping("/resend-verification-code")
    public ResponseEntity<String> resendVerificationCode(@RequestBody VerificationRequestDto request) {
        try {
            cognitoService.resendVerificationCode(request.getUsername());

            return ResponseEntity.ok("{\"message\": \"User logged in successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"An error occured while resending: " + e.getMessage() + "\"}");
        }
    }
}
