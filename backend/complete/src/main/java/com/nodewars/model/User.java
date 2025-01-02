package com.nodewars.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

/**
 * Represents a user entity in the database.
 * This class contains user information such as username, email, password, and profile picture.
 * It also includes fields for user statistics, preferred username, preferred language, and verification status.
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

    @Column(name = "elo")
    private double elo;

    @Column(name = "preferred_username")
    private String preferredUsername;

    @Column(name = "preferred_language")
    private String preferredLanguage;

    @Column(name = "friends")
    private String[] friends;

    @Column(name = "friend_requests")
    private String[] friendRequests;

    @Transient
    private boolean isVerified; 

    public User(String email, String cognitoUserId, String username, String password, String stats, double elo, String preferredUsername, String preferredLanguage, String[] friends, String profilePicture, String[] friendRequests) {
        this.email = email;
        this.cognitoUserId = cognitoUserId;
        this.username = username;
        this.password = password;
        this.stats = stats;
        this.elo = elo;
        this.preferredUsername = preferredUsername;
        this.preferredLanguage = preferredLanguage;
        this.friends = friends;
        this.profilePicture = profilePicture;
        this.friendRequests = friendRequests;
    }

    public User(String email, String cognitoUserId, String username, String preferredUsername, Boolean isVerified) {
        this.email = email;
        this.cognitoUserId = cognitoUserId;
        this.username = username;
        this.preferredUsername = preferredUsername;
        this.isVerified = isVerified;
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

    public double getElo() {
        return elo;
    }

    public void setElo(double elo) {
        this.elo = elo;
    }

    public String getPreferredUsername() {
        return preferredUsername;
    }

    public void setPreferredUsername(String preferredUsername) {
        this.preferredUsername = preferredUsername;
    }

    public String getPreferredLanguage() {
        return preferredLanguage;
    }

    public void setPreferredLanguage(String preferredUsername) {
        this.preferredUsername = preferredLanguage;
    }

    public String[] getFriends() {
        return friends;
    }

    public void setFriends(String[] friends) {
        this.friends = friends;
    }

    public boolean getIsVerified() {
        return isVerified;
    }

    public void setVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }

    public String[] getFriendRequests() {
        return friendRequests;
    }

    public void setFriendRequests(String[] friendRequests) {
        this.friendRequests = friendRequests;
    }
}
