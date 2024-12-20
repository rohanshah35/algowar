package com.nodewars.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
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
import com.nodewars.utils.CognitoUtils;
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
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private CognitoService cognitoService;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private CognitoUtils cognitoUtils;



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

            return ResponseEntity.status(HttpStatus.CREATED).body("{\"message\": \"User is authenticated\", \"sub\": \"" + userSub + "\"}");
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
                    .secure(false)
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

            String username = cognitoService.getUsernameByUserSub(request.getUserSub());
            cognitoService.verifyEmail(username, request.getVerificationCode());
            String password = userService.getUserByUsername(username).getPassword();
            String idToken = cognitoService.login(username, password);
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
            String username = cognitoService.getUsernameByUserSub(request.getUserSub());
            cognitoService.resendVerificationCode(username);

            return ResponseEntity.ok("{\"message\": \"User logged in successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"An error occured while resending: " + e.getMessage() + "\"}");
        }
    }

    /**
     * Logs out the user by deleting the ID token cookie.
     * @return a success message
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        ResponseCookie cookie = ResponseCookie.from("idToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("{\"message\": \"User logged out successfully. Cookie: " + cookie.toString() + "\"}");
    }

    /**
     * Checks if the user is authenticated by verifying the ID token cookie.
     * 401 Unauthorized is returned if the user is not authenticated.
     * @return a success message
     */
    @PostMapping("/check-auth")
    public ResponseEntity<String> checkAuth(@CookieValue(name = "idToken", required = false) String idToken) {
        try {
            if (idToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("{\"error\": \"User is not authenticated\"}");
            }

            String username = cognitoUtils.verifyAndGetUsername(idToken);

            if (username == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("{\"error\": \"User is not authenticated\"}");
            }
            
            return ResponseEntity.ok("{\"message\": \"User is authenticated\", \"username\": \"" + username + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"User is not authenticated: " + e.getMessage() + "\"}");
        }
    }
}
