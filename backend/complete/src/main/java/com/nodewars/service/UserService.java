package com.nodewars.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nodewars.model.User;
import com.nodewars.repository.UserRepository;

/**
 * Service class for managing users.
 */
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User createUser(String email, String cognitoUserId, String username, String password) {
        User user = new User(email, cognitoUserId, username, password);

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
}
