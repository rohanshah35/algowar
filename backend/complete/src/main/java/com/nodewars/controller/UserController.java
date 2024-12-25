package com.nodewars.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

import com.nodewars.service.UserService;
import com.nodewars.model.User;
import com.nodewars.service.CognitoService;
import com.nodewars.utils.CognitoUtils;

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
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }
    }

    /**
     * Endpoint to fetch stats for a given username.
     * @param username the username
     * @return the stats JSON
     */
    @GetMapping("/stats/{username}")
    public ResponseEntity<Map<String, String>>  getStats(@PathVariable String username) {
        Map<String, String> response = new HashMap<>();
        try {
            String stats = userService.getStatsByUsername(username);

            if (stats == null) {
                response.put("stats", "{}");
                return ResponseEntity.notFound().build();
            }

            response.put("stats", stats);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }
    }

    /**
     * Endpoint to fetch the profile picture for a given username.
     * @param username the username
     * @return the profile picture
     */
    @GetMapping("/pfp/{username}")
    public ResponseEntity<Map<String, String>> getPfp(@PathVariable String username) {
        Map<String, String> response = new HashMap<>();
        try {
            String pfp = userService.getPfpByUsername(username);
            response.put("pfp", pfp);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }
    }

    /**
     * Endpoint to fetch the preferred language for a given username.
     * @param username the username
     * @return the preferred language
     */
    @GetMapping("/language/{username}")
    public ResponseEntity<Map<String, String>> getPreferredLanguage(@PathVariable String username) {
        Map<String, String> response = new HashMap<>();
        try {
            String language = userService.getPreferredLanguageByPreferredUsername(username);
            response.put("preferred_language", language);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
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
            response.put("error", e.getMessage());
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

            cognitoService.updateUsername(currentUser.getUsername(), newPreferredUsername);
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
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
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
            String currentUsername = currentUser.getUsername();


            cognitoService.updateEmail(currentUsername, newEmail);
            userService.updateEmail(currentUsername, newEmail);

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
            String currentUsername = currentUser.getUsername();

            cognitoService.changePassword(currentUsername, oldPassword, newPassword);

            userService.updatePassword(currentUsername, newPassword);
            
            response.put("message", "Password updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error updating password: {}", e.getMessage());
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

            cognitoService.deleteUserFromCognito(currentUsername);
            userService.deleteUser(currentUsername);

            response.put("message", "User account deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error deleting user: {}", e.getMessage());
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
