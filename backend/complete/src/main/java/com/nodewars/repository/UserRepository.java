package com.nodewars.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.nodewars.model.User;

/**
 * UserRepository is an interface that extends JpaRepository to provide CRUD operations 
 * for User entities. It is annotated with @Repository to indicate that it is a Spring 
 * Data repository.
 * 
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.username = :username")
    User findByUsername(String username);
    boolean existsByUsername(String username);

    @Query("SELECT u.stats FROM User u WHERE u.username = :username")
    String findStatsByUsername(@Param("username") String username);

    @Query("SELECT u.profilePicture FROM User u WHERE u.username = :username")
    String findPfpByUsername(@Param("username") String username);

    @Query("SELECT u.username FROM User u WHERE u.cognitoUserId = :cognitoUserId")
    String findUsernameByUsersub(@Param("cognitoUserId") String username);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE User u SET u.username = :newUsername WHERE u.username = :username")
    void updateUsername(@Param("username") String username, @Param("newUsername") String newUsername);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE User u SET u.email = :newEmail WHERE u.username = :username")
    void updateEmail(@Param("username") String username, @Param("newEmail") String newEmail);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE User u SET u.password = :newPassword WHERE u.username = :username")
    void updatePassword(@Param("username") String username, @Param("newPassword") String newPassword);
}
