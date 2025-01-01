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
import java.util.List;
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
     * Endpoint to get all users with their usernames and profile pictures.
     * The profile pictures are provided as presigned URLs.
     * @return ResponseEntity containing a list of users, each with a username and profile picture (presigned URL).
     */
    @GetMapping("/all")
    public ResponseEntity<Map<String, List<Map<String, String>>>> getAllUsers(@CookieValue(name = "idToken", required = false) String idToken) {
        Map<String, List<Map<String, String>>> response = new HashMap<>();

        try {
            User currentUser = cognitoUtils.verifyAndGetUser(idToken);
            String currentPreferredUsername = currentUser.getPreferredUsername();
            List<Object[]> usernamesAndPfps = userService.getAllUsernamesAndPfps();

            List<Map<String, String>> users = usernamesAndPfps.stream()
                    .filter(entry -> !entry[0].equals(currentPreferredUsername))
                    .map(entry -> {
                        String username = (String) entry[0];
                        String profilePicturePath = (String) entry[1];
                        String profilePictureUrl = s3Service.getPreSignedUrl(profilePicturePath);
                        return Map.of(
                                "username", username,
                                "profilePicture", profilePictureUrl
                        );
                    })
                    .toList();

            // Add the list of users to the response map
            response.put("users", users);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching all users: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint to check if a username exists.
     * @param username the username (preferred username) to check
     * @return true if the username exists, false otherwise
     */
    @GetMapping("/exists/{username}")
    public ResponseEntity<Map<String, String>> checkUsernameExists(@PathVariable String username) {
        Map<String, String> response = new HashMap<>();

        try {
            boolean exists = userService.preferredUsernameExists(username);
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
    @GetMapping({"/stats", "/stats/{preferredUsername}"})
    public ResponseEntity<Map<String, String>>  getStats(
        @PathVariable(required = false) String preferredUsername,
        @CookieValue(name = "idToken", required = false) String idToken) {
        Map<String, String> response = new HashMap<>();

        try {
            String username;

            if (preferredUsername != null) {
                username = preferredUsername;
            } else if (idToken != null) {
                username = cognitoUtils.verifyAndGetUser(idToken).getPreferredUsername();
            } else {
                throw new IllegalArgumentException("Username not provided in PathVariable or JWT.");
            }

            String stats = userService.getStatsByPreferredUsername(username);
            String pfp = s3Service.getPreSignedUrl(userService.getPfpByPreferredUsername(username));
            String elo = String.valueOf(userService.getEloByPreferredUsername(username));
            String friendCount = String.valueOf(userService.getFriendsByPreferredUsername(username).size());

            if (idToken != null && preferredUsername != null) {
                String currentPreferredUsername = cognitoUtils.verifyAndGetUser(idToken).getPreferredUsername();
                if (userService.getFriendsByPreferredUsername(currentPreferredUsername).stream()
                        .noneMatch(friend -> userService.getUserByUsername(String.valueOf(friend[0])).getPreferredUsername().equals(username))) {
                    response.put("isFriend", "false");
                } else {
                    response.put("isFriend", "true");
                }
            }

            if (stats == null) {
                response.put("stats", "{}");
                return ResponseEntity.notFound().build();
            }

            response.put("stats", stats);
            response.put("pfp", pfp);
            response.put("elo", elo);
            response.put("friendCount", friendCount);
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
     * If a PathVariable is provided, it takes precedence over the username in the JWT cookie.
     * @param preferredUsername (optional) the username as a path variable
     * @return the profile picture
     */
    @GetMapping({"/pfp", "/pfp/{preferredUsername}"})
    public ResponseEntity<Map<String, String>> getPfp(
            @PathVariable(required = false) String preferredUsername,
            @CookieValue(name = "idToken", required = false) String idToken) {
        Map<String, String> response = new HashMap<>();
        try {
            String username;

            if (preferredUsername != null) {
                username = preferredUsername;
            } else if (idToken != null) {
                username = cognitoUtils.verifyAndGetUser(idToken).getPreferredUsername();
            } else {
                throw new IllegalArgumentException("Username not provided in PathVariable or JWT.");
            }

            // Fetch profile picture and pre-signed URL
            String pfp = userService.getPfpByPreferredUsername(username);
            String preSignedUrl = s3Service.getPreSignedUrl(pfp);
            response.put("pfp", preSignedUrl);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching profile picture: {}", e.getMessage());
            response.put("error", "An error has occurred, please try again.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Endpoint to fetch the preferred language for a given username.
     * @param username the username
     * @return the preferred language
     */
    @GetMapping({"/language", "/language/{preferredUsername}"})
    public ResponseEntity<Map<String, String>> getPreferredLanguage(
        @PathVariable(required = false) String preferredUsername,
        @CookieValue(name = "idToken", required = false) String idToken) {
        Map<String, String> response = new HashMap<>();

        try {
            String username;

            if (preferredUsername != null) {
                username = preferredUsername;
            } else if (idToken != null) {
                username = cognitoUtils.verifyAndGetUser(idToken).getPreferredUsername();
            } else {
                throw new IllegalArgumentException("Username not provided in PathVariable or JWT.");
            }

            String language = userService.getPreferredLanguageByPreferredUsername(username);
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
     * Endpoint to fetch the friends for a given username.
     * @param preferredUsername the preferred username (optional, via path variable)
     * @param idToken the ID token (optional, via cookie)
     * @return the friends' details
     */
    @GetMapping({"/friends", "/friends/{preferredUsername}"})
    public ResponseEntity<Map<String, Object>> getFriends(
        @PathVariable(required = false) String preferredUsername,
        @CookieValue(name = "idToken", required = false) String idToken
    ) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username;

            if (preferredUsername != null) {
                username = preferredUsername;
            } else if (idToken != null) {
                username = cognitoUtils.verifyAndGetUser(idToken).getPreferredUsername();
            } else {
                throw new IllegalArgumentException("Username not provided in PathVariable or JWT.");
            }

            List<Object[]> friendsData = userService.getFriendsByPreferredUsername(username);

            List<Map<String, String>> friends = friendsData.stream()
                .map(entry -> {
                    String friendPreferredUsername = (String) entry[0];
                    String profilePicturePath = (String) entry[1];
                    String profilePictureUrl = s3Service.getPreSignedUrl(profilePicturePath);
                    return Map.of(
                        "username", friendPreferredUsername,
                        "profilePicture", profilePictureUrl
                    );
                })
                .toList();

            response.put("friends", friends);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching friends: {}", e.getMessage());
            response.put("error", "An error has occurred, please try again.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }


    /**
     * Endpoint to add a friend to the user's friends array.
     * @param newFriend the friend to add (preferred username)
     * @return success/error message
     */
    @PostMapping("/friends/add/{newFriend}")
    public ResponseEntity<Map<String, String>> addFriend(
        @CookieValue(name = "idToken", required = false) String idToken,
        @PathVariable String newFriend) {
        Map<String, String> response = new HashMap<>();

        try {
            User currentUser = cognitoUtils.verifyAndGetUser(idToken);
            String preferredUsername = currentUser.getPreferredUsername();

            newFriend = userService.getUserByPreferredUsername(newFriend).getPreferredUsername();

            userService.addFriend(preferredUsername, newFriend);
            response.put("message", "Friend added successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error adding friend: {}", e.getMessage());
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Endpoint to delete a friend from the user's friends array.
     * @param preferredUsername the user's preferred username
     * @param friendToDelete the friend to delete (preferred username)
     * @return success/error message
     */
    @DeleteMapping("/friends/{friendToDelete}")
    public ResponseEntity<Map<String, String>> deleteFriend(
        @CookieValue(name = "idToken", required = false) String idToken,
        @PathVariable String friendToDelete) {
        Map<String, String> response = new HashMap<>();

        try {
            User currentUser = cognitoUtils.verifyAndGetUser(idToken);
            String preferredUsername = currentUser.getPreferredUsername();

            String friendPreferredUsername = userService.getUserByPreferredUsername(friendToDelete).getPreferredUsername();

            userService.deleteFriend(preferredUsername, friendPreferredUsername);
            response.put("message", "Friend deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error removing friend: {}", e.getMessage());
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
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

    /**
     * Endpoint to update a user's profile picture.
     * @param idToken contains the JWT token
     * @param file contains the new profile picture
     * @return success/error message
     */
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

    /**
     * Endpoint to get the top users with their preferred usernames, wins, and ELO.
     * @return a list of Object arrays containing preferred_username, wins, and ELO
     */
    @GetMapping("/leaderboard")
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard() {
        try {
            List<Object[]> leaderboard = userService.getTopUsersWithWinsAndElo();
            List<Map<String, Object>> jsonResponse = leaderboard.stream().map(user -> {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("preferredUsername", user[0]);
                userMap.put("wins", user[1]);
                userMap.put("elo", user[2]);
                return userMap;
            }).toList();

            return ResponseEntity.ok(jsonResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
