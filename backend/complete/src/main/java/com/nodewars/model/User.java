package com.nodewars.model;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Represents a user entity with various attributes such as email, username, password, 
 * Cognito user ID, profile picture, and stats.
 * 
 * This class is annotated with JPA annotations to map it to a database table named "users". 
 * It includes fields for the user's ID, email, username, password, Cognito user ID, profile picture, 
 * and stats, along with their respective getters and setters.
 * 
 */
@Entity
@Table(name = "users")
public class User {
    @Id
    @Column(name = "username")
    private String username;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "cognito_user_id")
    private String cognitoUserId;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "stats")
    private String stats;

    @Column(name = "preferred_username")
    private String preferredUsername;

    public User(String email, String cognitoUserId, String username, String password, String stats, String preferredUsername) {
        this.email = email;
        this.cognitoUserId = cognitoUserId;
        this.username = username;
        this.password = password;
        this.stats = stats;
        this.preferredUsername = preferredUsername;
    }

    public User(String email, String cognitoUserId, String username, String preferredUsername) {
        this.email = email;
        this.cognitoUserId = cognitoUserId;
        this.username = username;
        this.preferredUsername = preferredUsername;
    }

    public User() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCognitoUserId() {
        return cognitoUserId;
    }

    public void setCognitoUserId(String cognitoUserId) {
        this.cognitoUserId = cognitoUserId;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getStats() {
        return stats;
    }

    public void setStats(String stats) {
        this.stats = stats;
    }

    public String getPreferredUsername() {
        return preferredUsername;
    }

    public void setPreferredUsername(String preferredUsername) {
        this.preferredUsername = preferredUsername;
    }
}