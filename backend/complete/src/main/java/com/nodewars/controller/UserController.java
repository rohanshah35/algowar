package com.nodewars.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
     * Endpoint to update a user's username.
     * @param authorizationHeader contains the JWT token
     * @param request contains the new username
     * @return success/error message
     */
    @PutMapping("/update/username")
    public ResponseEntity<Map<String, String>> updateUsername(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            String newPreferredUsername = request.get("newUsername");

            User currentUser = cognitoUtils.verifyAndGetUser(token);
            String currentPreferredUsername = currentUser.getPreferredUsername();
            logger.info("currentPreferredUsername: " + currentPreferredUsername);
            logger.info("newPreferredUsername: " + newPreferredUsername);
            if (userService.usernameExists(newPreferredUsername)) {
                response.put("error", "Username already exists");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            cognitoService.updateUsername(currentPreferredUsername, newPreferredUsername);
            userService.updatePreferredUsername(currentPreferredUsername, newPreferredUsername);

            response.put("message", "Username updated successfully");
            return ResponseEntity.ok(response);
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
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            String newEmail = request.get("newEmail");

            User currentUser = cognitoUtils.verifyAndGetUser(token);
            String currentUsername = currentUser.getUsername();


            cognitoService.updateEmail(currentUsername, newEmail);
            userService.updateEmail(currentUsername, newEmail);

            response.put("message", "Email updated successfully");
            return ResponseEntity.ok(response);
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
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Map<String, String> passwordRequest) {
        Map<String, String> response = new HashMap<>();
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            String oldPassword = passwordRequest.get("oldPassword");
            String newPassword = passwordRequest.get("newPassword");

            User currentUser = cognitoUtils.verifyAndGetUser(token);
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
            @RequestHeader("Authorization") String authorizationHeader) {
        Map<String, String> response = new HashMap<>();
        try {
            String token = authorizationHeader.replace("Bearer ", "");

            User currentUser = cognitoUtils.verifyAndGetUser(token);
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