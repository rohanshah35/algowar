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
}
