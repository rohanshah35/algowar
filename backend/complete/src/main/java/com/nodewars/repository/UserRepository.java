package com.nodewars.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.nodewars.model.User;

/**
 * JPA Repository interface for User entity operations.
 * 
 * This repository provides database operations for user management, with methods grouped into three categories:
 * 1. Operations using internal username (used by Cognito)
 * 2. Operations using preferred username (displayed username)
 * 3. Operations using other identifiers (email, Cognito user ID)
 * 
 * The repository supports:
 * - CRUD operations for user accounts
 * - User lookup by various identifiers (username, email, Cognito ID)
 * - Profile updates (username, email, password, language preferences)
 * - Statistics and profile picture management
 * 
 * All update operations are transactional and automatically clear the persistence context
 * to ensure consistency.
 */

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Queries using 'username'

    @Query("SELECT u FROM User u WHERE LOWER(u.username) = LOWER(:username)")
    User findByUsername(String username);
    boolean existsByUsername(String username);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE User u SET u.preferredUsername = :newPreferredUsername WHERE LOWER(u.username) = LOWER(:username)")
    void updatePreferredUsername(@Param("username") String username, @Param("newPreferredUsername") String newPreferredUsername);

    // Queries using 'preferred username'

    @Query("SELECT u FROM User u WHERE u.preferredUsername = :preferredUsername")
    User findByPreferredUsername(String preferredUsername);
    boolean existsByPreferredUsername(String preferredUsername);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE User u SET u.email = :newEmail WHERE u.preferredUsername = :preferredUsername")
    void updateEmail(@Param("preferredUsername") String username, @Param("newEmail") String newEmail);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE User u SET u.password = :newPassword WHERE u.preferredUsername = :preferredUsername")
    void updatePassword(@Param("preferredUsername") String username, @Param("newPassword") String newPassword);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE User u SET u.preferredLanguage = :newPreferredLanguage WHERE u.preferredUsername = :preferredUsername")
    void updatePreferredLanguage(@Param("preferredUsername") String preferredUsername, @Param("newPreferredLanguage") String newPreferredLanguage);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE User u SET u.stats = :newStats WHERE u.preferredUsername = :preferredUsername")
    void updateStats(@Param("preferredUsername") String preferredUsername, @Param("newStats") String newStats);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE User u SET u.profilePicture = :newPfp WHERE u.preferredUsername = :preferredUsername")
    void updatePfp(@Param("preferredUsername") String preferredUsername, @Param("newPfp") String newPfp);

    @Modifying
    @Transactional
    @Query(value = "UPDATE users SET friends = array_append(friends, :newFriend) WHERE preferred_username = :preferredUsername AND NOT (:newFriend = ANY(friends))", nativeQuery = true)
    void addFriend(@Param("preferredUsername") String preferredUsername, @Param("newFriend") String newFriend);

    @Modifying
    @Transactional
    @Query(value = "UPDATE users SET friends = array_remove(friends, :friendToRemove) WHERE preferred_username = :preferredUsername", nativeQuery = true)
    void deleteFriend(@Param("preferredUsername") String preferredUsername, @Param("friendToRemove") String friendToRemove);

    @Modifying
    @Transactional
    @Query(value = "UPDATE users SET friend_requests = array_append(friend_requests, :newFriend) WHERE preferred_username = :preferredUsername AND NOT (:newFriend = ANY(friend_requests))", nativeQuery = true)
    void addFriendRequest(@Param("preferredUsername") String preferredUsername, @Param("newFriend") String newFriend);
    
    @Modifying
    @Transactional
    @Query(value = "UPDATE users SET friend_requests = array_remove(friend_requests, :friendToRemove) WHERE preferred_username = :preferredUsername", nativeQuery = true)
    void deleteFriendRequest(@Param("preferredUsername") String preferredUsername, @Param("friendToRemove") String friendToRemove);
     

    @Modifying
    @Transactional
    @Query("DELETE FROM User u WHERE u.preferredUsername = :preferredUsername")
    void deleteUser(@Param("preferredUsername") String preferredUsername);

    // Queries not using 'username' or 'preferred username'

    @Query("SELECT u FROM User u WHERE u.email = :email")
    User findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.cognitoUserId = :cognitoUserId")
    User findUserByUsersub(@Param("cognitoUserId") String cognitoUserId);

    @Query("SELECT u.preferredUsername FROM User u")
    String[] findAllUsernames();    

    @Query("SELECT u.preferredUsername, u.profilePicture FROM User u")
    List<Object[]> findPreferredUsernamesAndProfilePictures();

    @Query(value = "SELECT preferred_username, CAST((stats::JSONB)->>'wins' AS INTEGER) AS wins, elo FROM users ORDER BY elo DESC LIMIT 100", nativeQuery = true)
    List<Object[]> findTopUsersWithWinsAndElo();
    
    @Query(value = "SELECT f.preferred_username, f.profile_picture " +
               "FROM users u " +
               "JOIN users f ON f.username = ANY(u.friends) " +
               "WHERE u.preferred_username = :preferredUsername", 
       nativeQuery = true)
    List<Object[]> findFriendsByPreferredUsername(@Param("preferredUsername") String preferredUsername);

    @Query(value = "SELECT f.preferred_username, f.profile_picture " +
               "FROM users u " +
               "JOIN users f ON f.username = ANY(u.friend_requests) " +
               "WHERE u.preferred_username = :preferredUsername", 
       nativeQuery = true)
    List<Object[]> findFriendRequestsByPreferredUsername(@Param("preferredUsername") String preferredUsername);

    @Query(value = "SELECT COUNT(*) + 1 FROM users WHERE elo > (SELECT elo FROM users WHERE preferred_username = :preferredUsername)", nativeQuery = true)
    int findRankByPreferredUsername(@Param("preferredUsername") String preferredUsername);

    @Query(value = "SELECT created_at FROM users WHERE preferred_username = :preferredUsername", nativeQuery = true)
    String findCreationDateByPreferredUsername(@Param("preferredUsername") String preferredUsername);

}
