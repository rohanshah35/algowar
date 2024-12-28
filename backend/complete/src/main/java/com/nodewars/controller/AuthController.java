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

import java.util.HashMap;
import java.util.Map;

import com.nodewars.dto.LoginRequestDto;
import com.nodewars.dto.SignUpRequestDto;
import com.nodewars.dto.VerificationRequestDto;
import com.nodewars.model.User;
import com.nodewars.service.CognitoService;
import com.nodewars.service.S3Service;
import com.nodewars.service.UserService;
import com.nodewars.utils.CognitoUtils;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private CognitoService cognitoService;

    @Autowired
    private CognitoUtils cognitoUtils;

    @Autowired
    private S3Service s3Service;

    /**
     * Registers a new user and saves the user data to the database. 
     * 201 Created is returned if the user is successfully created.
     * 400 Bad Request is returned if an error occurs during user creation.
     * @param request the sign-up request containing the user's email, username, and password
     * @return a success message
     */
    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signUp(@RequestBody SignUpRequestDto request) {
        Map<String, String> response = new HashMap<>();

        try {
            String userSub = cognitoService.signUp(request.getUsername(), request.getEmail(), request.getPassword());
            String stats = "{\"wins\": 0, \"losses\": 0}";
            String preferred_language = "python3";
            userService.createUser(request.getEmail(), userSub, request.getUsername(), request.getPassword(), stats, request.getUsername(), preferred_language);

            response.put("sub", userSub);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Error signing up user: " + e.getMessage());
            response.put("error", "An error has occurred, please try again.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Logs in a user and returns an ID token.
     * 401 Unauthorized is returned if authentication fails.
     * @param request the login request containing the username and password
     * @return the ID token of the authenticated user
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequestDto request) {
        Map<String, String> response = new HashMap<>();

        try {
            String idToken;
            if (request.getUsername().contains("@")) {
                User currentUser = userService.getUserByEmail(request.getUsername());
                idToken = cognitoService.login(currentUser.getUsername(), request.getPassword());
            } else {
                User currentUser = userService.getUserByPreferredUsername(request.getUsername());
                idToken = cognitoService.login(currentUser.getUsername(), request.getPassword());
            }
            ResponseCookie cookie = ResponseCookie.from("idToken", idToken)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(3600)
                    .build();
            response.put("cookie", cookie.toString());
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (Exception e) {
            logger.error("Error logging in user: " + e.getMessage());
            response.put("error", "An error has occurred, please try again.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
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
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestBody VerificationRequestDto request) {
        Map<String, String> response = new HashMap<>();

        try {
            String username = userService.getUsernameByUserSub(request.getUserSub());
            cognitoService.verifyEmail(username, request.getVerificationCode());
            String password = userService.getUserByUsername(username).getPassword();
            String idToken = cognitoService.login(username, password);
            ResponseCookie cookie = ResponseCookie.from("idToken", idToken)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(3600)
                    .build();

            response.put("cookie", cookie.toString());
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (Exception e) {
            logger.error("Error verifying email: " + e.getMessage());
            response.put("error", "An error has occurred, please try again.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Resends the verification code to the user's email address.
     * 400 Bad Request is returned if an error occurs during resending the verification code.
     * @param request the verification request containing the username
     * @return a success message
     */
    @PostMapping("/resend-verification-code")
    public ResponseEntity<Map<String, String>> resendVerificationCode(@RequestBody VerificationRequestDto request) {
        Map<String, String> response = new HashMap<>();

        try {
            String username = userService.getUsernameByUserSub(request.getUserSub());
            cognitoService.resendVerificationCode(username);
            response.put("message", "Successfully resent");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error resending verification code: " + e.getMessage());
            response.put("error", "An error has occurred, please try again.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Logs out the user by deleting the ID token cookie.
     * @return a success message
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        Map<String, String> response = new HashMap<>();

        try {
            ResponseCookie cookie = ResponseCookie.from("idToken", "")
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(0)
                    .build();

            response.put("cookie", cookie.toString());
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (Exception e) {
            logger.error("Error logging out user: " + e.getMessage());
            response.put("error", "An error has occurred, please try again.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Checks if the user is authenticated by verifying the ID token cookie.
     * 401 Unauthorized is returned if the user is not authenticated.
     * @return a success message
     */
    @PostMapping("/check-auth")
    public ResponseEntity<Map<String, String>> checkAuth(@CookieValue(name = "idToken", required = false) String idToken) {
        Map<String, String> response = new HashMap<>();
        
        try {
            if (idToken == null) {
                response.put("error", "User is not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(response);
            }

            User currentUser = cognitoUtils.verifyAndGetUser(idToken);
            String username = currentUser.getUsername();

            if (username == null) {
                response.put("error", "User is not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(response);
            }  
            
            String s3Key = userService.getPfpByPreferredUsername(currentUser.getPreferredUsername());
            
            response.put("username", currentUser.getPreferredUsername());
            response.put("email", currentUser.getEmail());
            response.put("sub", currentUser.getCognitoUserId());
            response.put("isVerified", currentUser.getIsVerified() ? "true" : "false");
            response.put("profilePicture", s3Service.getPreSignedUrl(s3Key));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error checking authentication: " + e.getMessage());
            response.put("error", "An error has occurred, please try again.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}