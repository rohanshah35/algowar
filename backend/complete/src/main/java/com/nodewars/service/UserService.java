package com.nodewars.service;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nodewars.model.User;
import com.nodewars.repository.UserRepository;

/**
 * Service class for managing user-related operations.
 * This class provides methods for user creation, retrieval, and updates.
 * It also includes methods for checking username existence, fetching user statistics, and updating user attributes.
 */

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(String email, String cognitoUserId, String username, String password, String stats, String preferredUsername, String preferredLanguage, String[] friends) {
        User user = new User(email, cognitoUserId, username, password, stats, preferredUsername, preferredLanguage, friends);

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
    public String getStatsByPreferredUsername(String preferredUsername) {
        return userRepository.findByPreferredUsername(preferredUsername).getStats();
    }

    /**
     * Fetches the profile picture for a given username.
     * @param username the username
     * @return the profile picture as a string
     */
    public String getPfpByPreferredUsername(String preferredUsername) {
        return userRepository.findByPreferredUsername(preferredUsername).getProfilePicture();
    }

    /**
     * Fetches the profile picture for a given username.
     * @param sub the username
     * @return the profile picture as a string
     */
    public String getUsernameByUserSub(String sub) {
        return userRepository.findUserByUsersub(sub).getUsername();
    }

    /**
     * Fetches the preferred language for a given preferred username.
     * @param preferred_username the preferred username
     * @return the preferred language as a string
     */
    public String getPreferredLanguageByPreferredUsername(String preferredUsername) {
        return userRepository.findByPreferredUsername(preferredUsername).getPreferredLanguage();
    }

    /**
     * Fetches the friends for a given preferred username.
     * @param preferredUsername the preferred username
     * @return the friends as a string array
     */
    public String[] getFriendsByPreferredUsername(String preferredUsername) {
        return userRepository.findByPreferredUsername(preferredUsername).getFriends();
    }

    /**
     * Updates a user's preferred language in the database by their preferred username.
     * @param preferredUsername the user's preferred username
     * @param newPreferredLanguage the new preferred language
     * @throws Exception if the user is not found
     */
    @Transactional
    public void updatePreferredLanguage(String preferredUsername, String newPreferredLanguage) throws Exception {
        if (!userRepository.existsByPreferredUsername(preferredUsername)) {
            throw new Exception("User not found");
        }

        userRepository.updatePreferredLanguage(preferredUsername, newPreferredLanguage);
    }

    /**
     * Updates a user's username in the database.
     * @param preferredUsername the user's preferred username
     * @param newUsername the new username
     * @throws Exception if the username is already taken
     */
    @Transactional
    public void updatePreferredUsername(String preferredUsername, String newPreferredUsername) throws Exception {
        User currentUser = userRepository.findByPreferredUsername(preferredUsername);
        if (currentUser == null) {
            throw new Exception("User not found");
        }

        if (userRepository.existsByPreferredUsername(newPreferredUsername)) {
            throw new Exception("Username already taken");
        }

        userRepository.updatePreferredUsername(currentUser.getUsername(), newPreferredUsername);
    }

    /**
     * Updates a user's email in the database.
     * @param preferredUsername the user's preferred username
     * @param newEmail the new email
     * @throws Exception if the user is not found
     */
    @Transactional
    public void updateEmail(String preferredUsername, String newEmail) throws Exception {
        if (!userRepository.existsByPreferredUsername(preferredUsername)) {
            throw new Exception("User not found");
        }

        userRepository.updateEmail(preferredUsername, newEmail);
    }

    /**
     * Updates a user's password in the database.
     * @param preferredUsername the user's preferred username
     * @param newPassword the new password
     * @throws Exception if the user is not found
     */
    @Transactional
    public void updatePassword(String preferredUsername, String newPassword) throws Exception {
        if (!userRepository.existsByPreferredUsername(preferredUsername)) {
            throw new Exception("User not found");
        }

        userRepository.updatePassword(preferredUsername, newPassword);
    }

    /**
     * Updates a user's stats in the database.
     * @param preferredUsername the user's preferred username
     * @param newStats the new stats
     * @throws Exception if the user is not found
     */
    @Transactional
    public void updateStats(String preferredUsername, String newStats) throws Exception {
        if (!userRepository.existsByPreferredUsername(preferredUsername)) {
            throw new Exception("User not found");
        }

        userRepository.updateStats(preferredUsername, newStats);
    }

    /**
     * Updates a user's profile picture in the database.
     * @param preferredUsername the user's preferred username
     * @param newProfilePicture the new profile picture s3 key
     * @throws Exception if the user is not found
     */
    @Transactional
    public void updateProfilePicture(String preferredUsername, String newProfilePicture) throws Exception {
        if (!userRepository.existsByPreferredUsername(preferredUsername)) {
            throw new Exception("User not found");
        }

        userRepository.updatePfp(preferredUsername, newProfilePicture);
    }

    /**
     * Adds a friend to the user's friends array in the database.
     * @param preferredUsername the user's preferred username
     * @param newFriend the friend to add
    * @throws Exception if the user is not found
    */
    @Transactional
    public void addFriend(String preferredUsername, String newFriend) throws Exception {
        if (!userRepository.existsByPreferredUsername(preferredUsername)) {
            throw new Exception("User not found");
        }

        String[] currentFriends = userRepository.findByPreferredUsername(preferredUsername).getFriends();
        if (Arrays.asList(currentFriends).contains(newFriend)) {
            throw new Exception("Friend already exists");
        }

        userRepository.addFriend(preferredUsername, newFriend);
    }

    /**
     * Removes a friend from the user's friends array in the database.
     * @param preferredUsername the user's preferred username
     * @param friendToDelete the friend to remove
     * @throws Exception if the user is not found or the friend does not exist
     */
    @Transactional
    public void deleteFriend(String preferredUsername, String friendToDelete) throws Exception {
        if (!userRepository.existsByPreferredUsername(preferredUsername)) {
            throw new Exception("User not found");
        }

        String[] currentFriends = userRepository.findByPreferredUsername(preferredUsername).getFriends();

        if (currentFriends == null || !Arrays.asList(currentFriends).contains(friendToDelete)) {
            throw new Exception("Friend not found");
        }

        userRepository.deleteFriend(preferredUsername, friendToDelete);
    }
    

    /**
     * Deletes a user by their username.
     * @param preferredUsername the preferred username of the user to delete
     * @throws Exception if the user does not exist
     */
    @Transactional
    public void deleteUser(String preferredUsername) throws Exception {
        if (!userRepository.existsByPreferredUsername(preferredUsername)) {
            throw new Exception("User not found");
        }

        userRepository.deleteUser(preferredUsername);
    }
}
