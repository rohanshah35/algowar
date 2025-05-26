package com.nodewars.service;

import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    public User createUser(String email, String cognitoUserId, String username, String password, String stats, double elo, String preferredUsername, String preferredLanguage, String[] friends, String profilePicture, String[] friendRequests) {
        User user = new User(email, cognitoUserId, username, password, stats, elo, preferredUsername, preferredLanguage, friends, profilePicture, friendRequests);

        return userRepository.save(user);
    }

    /**
     * Gets all usernames from the database.
     * @return a list of Object arrays containing preferred_username and profile_picture
     */
    public List<Object[]> getAllUsernamesAndPfps() {
        return userRepository.findPreferredUsernamesAndProfilePictures();
    }

    /**
     * Gets the top users with their preferred usernames, wins, and ELO.
     * @return a list of Object arrays containing preferred_username, wins, and ELO
     */
    public List<Object[]> getTopUsersWithWinsAndElo() {
        return userRepository.findTopUsersWithWinsAndElo();
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
     * Checks if a preferred username exists in the database.
     * @param preferredUsername the preferred username to check
     * @return true if the preferred username exists, false otherwise
     */
    public boolean preferredUsernameExists(String preferredUsername) {
        return userRepository.existsByPreferredUsername(preferredUsername);
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
     * Fetches the elo for a given username.
     * @param username the username
     * @return the elo as a double
     */
    public double getEloByPreferredUsername(String preferredUsername) {
        return userRepository.findByPreferredUsername(preferredUsername).getElo();
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
     * Fetches the rank for a given username.
     * @param preferredUsername the username
     * @return the rank as an integer
     */
    public int getRankByPreferredUsername(String preferredUsername) {
        if (!userRepository.existsByPreferredUsername(preferredUsername)) {
            return -1;
        }
        return userRepository.findRankByPreferredUsername(preferredUsername);
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
     * @return a list of Object arrays containing preferred_username and profile_picture
     */
    public List<Object[]> getFriendsByPreferredUsername(String preferredUsername) {
        return userRepository.findFriendsByPreferredUsername(preferredUsername);
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

        if (!userRepository.existsByUsername(newFriend)) {
            throw new Exception("Friend not found");
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
        friendToDelete = userRepository.findByUsername(friendToDelete).getPreferredUsername();
        preferredUsername = userRepository.findByPreferredUsername(preferredUsername).getUsername();
        userRepository.deleteFriend(friendToDelete, preferredUsername);
    }

    public String getCreationDateByPreferredUsername(String preferredUsername) {
        return userRepository.findCreationDateByPreferredUsername(preferredUsername);
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

    /**
     * Sends a friend request from preferredUsername to friendUsername.
     * @param preferredUsername
     * @param friendUsername
    * @throws Exception 
    */
    public void sendFriendRequest(String senderUsername, String friendPreferredUsername) throws Exception {
        User user = userRepository.findByUsername(senderUsername);
        User friend = userRepository.findByPreferredUsername(friendPreferredUsername);

        if (user == null) {
            throw new Exception("User not found");
        } else if (friend == null) {
            throw new Exception("Friend not found");
        }

        String[] currentFriends = friend.getFriends();
        if (Arrays.asList(currentFriends).contains(senderUsername)) {
            throw new Exception("Friend already exists");
        }
        userRepository.addFriendRequest(friendPreferredUsername, senderUsername);
    }

    /**
     * Accepts a friend request from friendUsername to preferredUsername.
     * @param preferredUsername
     * @param friendUsername
     */
    public void acceptFriendRequest(String senderUsername, String friendUsername) throws Exception {
        User user = userRepository.findByUsername(senderUsername);
        User friend = userRepository.findByUsername(friendUsername);

        if (user == null) {
            throw new Exception("User not found");
        } else if (friend == null) {
            throw new Exception("Friend not found");
        }

        String[] currentFriends = user.getFriendRequests();
        if (!Arrays.asList(currentFriends).contains(friendUsername)) {
            throw new Exception("Friend request not found");
        }

        userRepository.addFriend(user.getPreferredUsername(), friendUsername);
        userRepository.addFriend(friend.getPreferredUsername(), senderUsername);
        userRepository.deleteFriendRequest(senderUsername, friend.getUsername());
    }

    /**
     * Declines a friend request from friendUsername to preferredUsername.
     * @param preferredUsername
     * @param friendUsername
     */
    public void declineFriendRequest(String senderUsername, String friendUsername) throws Exception {
        User user = userRepository.findByUsername(senderUsername);
        User friend = userRepository.findByUsername(friendUsername);

        if (user == null) {
            throw new Exception("User not found");
        } else if (friend == null) {
            throw new Exception("Friend not found");
        }

        String[] currentFriends = user.getFriendRequests();
        if (!Arrays.asList(currentFriends).contains(friendUsername)) {
            throw new Exception("Friend request not found");
        }

        userRepository.deleteFriendRequest(user.getPreferredUsername(), friendUsername);
    }

    public List<Object[]> getFriendRequestsByPreferredUsername(String preferredUsername) {
        return userRepository.findFriendRequestsByPreferredUsername(preferredUsername);
    }
}
