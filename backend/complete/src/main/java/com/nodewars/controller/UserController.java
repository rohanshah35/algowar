package com.nodewars.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import com.nodewars.service.UserService;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

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
}
