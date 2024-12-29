package com.nodewars.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

import com.nodewars.service.UserService;
import com.nodewars.model.User;
import com.nodewars.service.CognitoService;
import com.nodewars.service.S3Service;
import com.nodewars.utils.CognitoUtils;

/**
 * REST controller that handles user profile management and information retrieval operations.
 * 
 * This controller provides endpoints for managing user profiles and accessing user-specific data.
 * It integrates with AWS Cognito for user management and S3 for profile picture storage.
 * 
 * Key functionalities include:
 * - Username existence checking
 * - User statistics retrieval
 * - Profile picture management
 * - User preferences management (language settings)
 * - Profile updates (username, email, password)
 * - Account deletion
 * 
 * All endpoints require authentication via JWT token (passed as a cookie) unless specifically noted.
 * Endpoints return appropriate HTTP status codes:
 * - 200 OK for successful operations
 * - 400 Bad Request for validation errors or operation failures
 * - 401 Unauthorized for authentication failures
 * - 404 Not Found for missing resources
 */

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private CognitoService cognitoService;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private CognitoUtils cognitoUtils;

    /**
     * Endpoint to check if a username exists.
     * @param username the username
     * @return true if the username exists, false otherwise
     */
    @GetMapping("/exists/{username}")
    public ResponseEntity<Map<String, String>> checkUsernameExists(@PathVariable String username) {
        Map<String, String> response = new HashMap<>();

        try {
            boolean exists = userService.usernameExists(username);
            response.put("exists", String.valueOf(exists));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error checking if username exists: {}", e.getMessage());
            response.put("error", "An error has occurred, please try again.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }
    }

    /**
     * Endpoint to fetch stats for a given username.
     * @param username the username
     * @return the stats JSON
     */
    @GetMapping("/stats/{preferredUsername}")
    public ResponseEntity<Map<String, String>>  getStats(@PathVariable String preferredUsername) {
        Map<String, String> response = new HashMap<>();
        try {
            String stats = userService.getStatsByPreferredUsername(preferredUsername);

            if (stats == null) {
                response.put("stats", "{}");
                return ResponseEntity.notFound().build();
            }

            response.put("stats", stats);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error checking if username exists: {}", e.getMessage());
            response.put("error", "An error has occurred, please try again.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }
    }

    /**
     * Endpoint to fetch the profile picture for a given username.
     * @param username the username
     * @return the profile picture
     */
    @GetMapping("/pfp")
    public ResponseEntity<Map<String, String>> getPfp(@PathVariable String preferredUsername) {
        Map<String, String> response = new HashMap<>();
        try {
            String pfp = userService.getPfpByPreferredUsername(preferredUsername);
            String preSignedUrl = s3Service.getPreSignedUrl(pfp);
            response.put("pfp", preSignedUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error checking if username exists: {}", e.getMessage());
            response.put("error", "An error has occurred, please try again.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }
    }

        /**
     * Endpoint to fetch the profile picture for a given username.
     * @param username the username
     * @return the profile picture
     */
    @GetMapping("/pfp-with-cookie")
    public ResponseEntity<Map<String, String>> getPfpWithCookie(@CookieValue(name = "idToken", required = false) String idToken) {
        Map<String, String> response = new HashMap<>();
        try {
            User currentUser = cognitoUtils.verifyAndGetUser(idToken);
            String pfp = userService.getPfpByPreferredUsername(currentUser.getPreferredUsername());
            response.put("pfp", s3Service.getPreSignedUrl(pfp));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error checking if username exists: {}", e.getMessage());
            response.put("error", "An error has occurred, please try again.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }
    }

    /**
     * Endpoint to fetch the preferred language for a given username.
     * @param username the username
     * @return the preferred language
     */
    @GetMapping("/language/{preferredUsername}")
    public ResponseEntity<Map<String, String>> getPreferredLanguage(@PathVariable String preferredUsername) {
        Map<String, String> response = new HashMap<>();

        try {
            String language = userService.getPreferredLanguageByPreferredUsername(preferredUsername);
            response.put("preferredLanguage", language);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error checking if username exists: {}", e.getMessage());
            response.put("error", "An error has occurred, please try again.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }
    }

    /**
     * Endpoint to update a user's preferred language.
     *
     * @param idToken contains the JWT token
     * @param request contains the new preferred language
     * @return success/error message
     */
    @PutMapping("/update/language")
    public ResponseEntity<Map<String, String>> updatePreferredLanguage(
            @CookieValue(name = "idToken", required = false) String idToken,
            @RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();
        
        try {
            String newPreferredLanguage = request.get("newPreferredLanguage");

            User currentUser = cognitoUtils.verifyAndGetUser(idToken);
            String currentPreferredUsername = currentUser.getPreferredUsername();

            userService.updatePreferredLanguage(currentPreferredUsername, newPreferredLanguage);

            response.put("message", "Preferred language updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error updating preferred language: {}", e.getMessage());
            response.put("error", "An error has occurred, please try again.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }


    /**
     * Endpoint to update a user's username.
     * @param authorizationHeader contains the JWT token
     * @param request contains the new username
     * @return success/error message
     */
    @PutMapping("/update/username")
    public ResponseEntity<Map<String, String>> updateUsername(
            @CookieValue(name = "idToken", required = false) String idToken,
            @RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();

        try {
            String newPreferredUsername = request.get("newUsername");

            User currentUser = cognitoUtils.verifyAndGetUser(idToken);

            if (userService.usernameExists(newPreferredUsername)) {
                response.put("error", "Username already exists");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            cognitoService.updatePreferredUsername(currentUser.getUsername(), newPreferredUsername);
            userService.updatePreferredUsername(currentUser.getPreferredUsername(), newPreferredUsername);

            currentUser = userService.getUserByUsername(currentUser.getUsername());

            String newIdToken = cognitoService.login(currentUser.getUsername(), currentUser.getPassword());

            ResponseCookie cookie = ResponseCookie.from("idToken", newIdToken)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .build();

            response.put("message", "Username updated successfully");
            response.put("cookie", cookie.toString());
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (Exception e) {
            logger.error("Error updating username: {}", e.getMessage());
            response.put("error", "An error has occurred, please try again.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }
    }

    /**
     * Endpoint to update a user's email.
     *
     * @param authorizationHeader contains the JWT token
     * @param request contains the new email
     * @return success/error message
     */
    @PutMapping("/update/email")
    public ResponseEntity<Map<String, String>> updateEmail(
            @CookieValue(name = "idToken", required = false) String idToken,
            @RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();
        
        try {
            String newEmail = request.get("newEmail");

            User currentUser = cognitoUtils.verifyAndGetUser(idToken);
            String currentPreferredUsername = currentUser.getPreferredUsername();


            cognitoService.updateEmail(currentPreferredUsername, newEmail);
            userService.updateEmail(currentPreferredUsername, newEmail);

            currentUser = userService.getUserByUsername(currentUser.getUsername());

            String newIdToken = cognitoService.login(currentUser.getUsername(), currentUser.getPassword());

            ResponseCookie cookie = ResponseCookie.from("idToken", newIdToken)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .build();

            response.put("message", "Email updated successfully");
            response.put("cookie", cookie.toString());
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (Exception e) {
            logger.error("Error updating email: {}", e.getMessage());
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Endpoint to update a user's password.
     *
     * @param authorizationHeader contains the JWT token
     * @param passwordRequest containing old and new passwords
     * @return success/error message
     */
    @PutMapping("/update/password")
    public ResponseEntity<Map<String, String>> updatePassword(
            @CookieValue(name = "idToken", required = false) String idToken,
            @RequestBody Map<String, String> passwordRequest) {
        Map<String, String> response = new HashMap<>();
        
        try {
            String oldPassword = passwordRequest.get("oldPassword");
            String newPassword = passwordRequest.get("newPassword");

            User currentUser = cognitoUtils.verifyAndGetUser(idToken);
            String currentPreferredUsername = currentUser.getPreferredUsername();

            cognitoService.changePassword(currentUser.getUsername(), oldPassword, newPassword);

            userService.updatePassword(currentPreferredUsername, newPassword);
            
            response.put("message", "Password updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error updating password: {}", e.getMessage());
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/update/pfp")
    public ResponseEntity<Map<String, String>> updatePfp(
            @CookieValue(name = "idToken", required = false) String idToken,
            @RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        try {
            User currentUser = cognitoUtils.verifyAndGetUser(idToken);
            String currentPreferredUsername = currentUser.getPreferredUsername();

            String s3Key = s3Service.uploadProfilePicture(currentPreferredUsername, file);
            userService.updateProfilePicture(currentPreferredUsername, s3Key);

            String preSignedUrl = s3Service.getPreSignedUrl(s3Key);

            response.put("message", "Profile picture updated successfully");
            response.put("s3Key", preSignedUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error updating profile picture: {}", e.getMessage());
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Endpoint to delete a user's account.
     * 
     * @param authorizationHeader contains the JWT token
     * @return success/error message
     */
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, String>> deleteUser(
        @CookieValue(name = "idToken", required = false) String idToken) {
        Map<String, String> response = new HashMap<>();
        
        try {

            User currentUser = cognitoUtils.verifyAndGetUser(idToken);
            String currentUsername = currentUser.getUsername();
            String currentPreferredUsername = currentUser.getPreferredUsername();

            cognitoService.deleteUserFromCognito(currentUsername);
            userService.deleteUser(currentPreferredUsername);

            response.put("message", "User account deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error deleting user: {}", e.getMessage());
            response.put("error", "An error has occurred, please try again.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
