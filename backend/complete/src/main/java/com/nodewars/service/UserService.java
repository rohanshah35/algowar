package com.nodewars.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nodewars.model.User;
import com.nodewars.repository.UserRepository;

/**
 * Service class for managing users.
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(String email, String cognitoUserId, String username, String password, String stats, String preferredUsername) {
        User user = new User(email, cognitoUserId, username, password, stats, preferredUsername);

        return userRepository.save(user);
    }

    /**
     * Gets a user by their username.
     * @param username the username of the user
     * @return the user
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Gets a user by their preferred username.
     * @param preferredUsername the preferred username of the user
     * @return the user
     */
    public User getUserByPreferredUsername(String preferredUsername) {
        return userRepository.findByPreferredUsername(preferredUsername);
    }

    /**
     * Gets a user by their email.
     * @param email the email of the user
     * @return the user
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Checks if a username exists in the database.
     * @param username the username to check
     * @return true if the username exists, false otherwise
     */
    public boolean usernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    /**
     * Fetches the stats for a given username.
     * @param username the username
     * @return the stats JSON as a string
     */
    public String getStatsByUsername(String username) {
        return userRepository.findStatsByUsername(username);
    }

    /**
     * Fetches the profile picture for a given username.
     * @param username the username
     * @return the profile picture as a string
     */
    public String getPfpByUsername(String username) {
        return userRepository.findPfpByUsername(username);
    }

    /**
     * Fetches the profile picture for a given username.
     * @param username the username
     * @return the profile picture as a string
     */
    public String getUsernameByUserSub(String sub) {
        return userRepository.findUsernameByUsersub(sub);
    }

    /**
     * Updates a user's username in the database.
     * @param currentUsername the user's current username
     * @param newUsername the new username
     * @throws Exception if the username is already taken
     */
    @Transactional
    public void updatePreferredUsername(String currentPreferredUsername, String newPreferredUsername) throws Exception {
        User currentUser = userRepository.findByPreferredUsername(currentPreferredUsername);
        if (currentUser == null) {
            throw new Exception("User not found");
        }

        if (userRepository.existsByUsername(newPreferredUsername)) {
            throw new Exception("Username already taken");
        }

        userRepository.updatePreferredUsername(currentUser.getUsername(), newPreferredUsername);
    }

    /**
     * Updates a user's email in the database.
     * @param currentUsername the user's current username
     * @param newEmail the new email
     * @throws Exception if the user is not found
     */
    @Transactional
    public void updateEmail(String currentUsername, String newEmail) throws Exception {
        User currentUser = userRepository.findByUsername(currentUsername);
        if (currentUser == null) {
            throw new Exception("User not found");
        }

        userRepository.updateEmail(currentUser.getUsername(), newEmail);
    }

    /**
     * Updates a user's password in the database.
     * @param currentUsername the user's current username
     * @param newPassword the new password
     * @throws Exception if the user is not found
     */
    @Transactional
    public void updatePassword(String currentUsername, String newPassword) throws Exception {
        User currentUser = userRepository.findByUsername(currentUsername);
        if (currentUser == null) {
            throw new Exception("User not found");
        }

        userRepository.updatePassword(currentUser.getUsername(), newPassword);
    }

    /**
     * Deletes a user by their username.
     * @param username the username of the user to delete
     * @throws Exception if the user does not exist
     */
    @Transactional
    public void deleteUser(String username) throws Exception {
        if (!userRepository.existsByUsername(username)) {
            throw new Exception("User not found");
        }

        userRepository.deleteByUsername(username);
    }
}
