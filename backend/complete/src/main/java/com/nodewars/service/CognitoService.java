package com.nodewars.service;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

import java.util.Arrays;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.nodewars.utils.CognitoUtils;

/**
 * Service class for handling AWS Cognito operations such as sign-up, login, and email verification.
 */
@Service
public class CognitoService {

    private final CognitoIdentityProviderClient cognitoClient;
    private static final Logger logger = LoggerFactory.getLogger(CognitoService.class);
    
    @Value("${aws.cognito.client-id}")
    private String clientId;
    
    @Value("${aws.cognito.client-secret}")
    private String clientSecret;

    @Value("${aws.credentials.access-key-id}")
    private String accessKeyId;

    @Value("${aws.credentials.secret-access-key}")
    private String secretAccessKey;

    @Value("${aws.cognito.region}")
    private String region;

    @Value("${aws.cognito.user-pool-id}")
    private String userPoolId;

    /**
     * Constructs a new CognitoService with a CognitoIdentityProviderClient.
     */
    @Autowired
    public CognitoService(
        @Value("${aws.credentials.access-key-id}") String accessKeyId,
        @Value("${aws.credentials.secret-access-key}") String secretAccessKey,
        @Value("${aws.cognito.region}") String region,
        @Value("${aws.cognito.user-pool-id}") String userPoolId
    ) {
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(
            accessKeyId,
            secretAccessKey
        );
        this.cognitoClient = CognitoIdentityProviderClient.builder()
            .region(Region.of(region)) // Change to your region
            .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
            .build();
    }

    /**
     * Signs up a new user in AWS Cognito.
     *
     * @param username the username of the new user
     * @param email the email address of the new user
     * @param password the password of the new user
     * @return the user sub (unique identifier) of the newly created user
     */
    public String signUp(String username, String email, String password) {
        String secretHash = CognitoUtils.calculateSecretHash(username, clientId, clientSecret);
        SignUpRequest request = SignUpRequest.builder()
            .clientId(clientId)
            .username(username)
            .password(password)
            .userAttributes(
                Arrays.asList(
                    AttributeType.builder().name("email").value(email).build(),
                    AttributeType.builder().name("preferred_username").value(username).build()
                )
            )
            .secretHash(secretHash)
            .build();

        SignUpResponse response = cognitoClient.signUp(request);
        return response.userSub();
    }

    /**
     * Logs in a user to AWS Cognito.
     *
     * @param username the username of the user
     * @param password the password of the user
     * @return the ID token of the authenticated user
     */
    public String login(String username, String password) {
        String secretHash = CognitoUtils.calculateSecretHash(username, clientId, clientSecret);

        InitiateAuthRequest request = InitiateAuthRequest.builder()
            .authFlow(AuthFlowType.USER_PASSWORD_AUTH)
            .clientId(clientId)
            .authParameters(Map.of(
                "USERNAME", username,
                "PASSWORD", password,
                "SECRET_HASH", secretHash
            ))
            .build();

        InitiateAuthResponse response = cognitoClient.initiateAuth(request);
        return response.authenticationResult().idToken();
    }

    /**
     * Verifies the email of a user in AWS Cognito.
     *
     * @param username the username of the user
     * @param verificationCode the verification code sent to the user's email
     */
    public void verifyEmail(String username, String verificationCode) {
        String secretHash = CognitoUtils.calculateSecretHash(username, clientId, clientSecret);
        ConfirmSignUpRequest request = ConfirmSignUpRequest.builder()
            .clientId(clientId)
            .username(username)
            .confirmationCode(verificationCode)
            .secretHash(secretHash)
            .build();

        cognitoClient.confirmSignUp(request);
    }

    /**
     * Resends the verification code to a user in AWS Cognito.
     *
     * @param username the email of the user
     */
    public void resendVerificationCode(String username) {
        String secretHash = CognitoUtils.calculateSecretHash(username, clientId, clientSecret);
        ResendConfirmationCodeRequest request = ResendConfirmationCodeRequest.builder()
            .clientId(clientId)
            .username(username)
            .secretHash(secretHash)
            .build();

        cognitoClient.resendConfirmationCode(request);
    }

    /**
     * Updates a user's preferred_username in Cognito using their current username.
     *
     * @param currentUsername the user's current username
     * @param newUsername     the new preferred username
     * @throws Exception if the update fails
     */
    public void updateUsername(String currentUsername, String newUsername) throws Exception {
        try {
            AdminGetUserRequest getUserRequest = AdminGetUserRequest.builder()
                    .username(currentUsername)
                    .userPoolId(userPoolId)
                    .build();

            AdminGetUserResponse getUserResponse = cognitoClient.adminGetUser(getUserRequest);

            System.out.println("User retrieved from Cognito: " + getUserResponse.username());

            AttributeType usernameAttribute = AttributeType.builder()
                    .name("preferred_username")
                    .value(newUsername)
                    .build();

            AdminUpdateUserAttributesRequest updateRequest = AdminUpdateUserAttributesRequest.builder()
                    .userPoolId(userPoolId)
                    .username(currentUsername)
                    .userAttributes(usernameAttribute)
                    .build();

            cognitoClient.adminUpdateUserAttributes(updateRequest);

            System.out.println("Preferred username updated successfully to: " + newUsername);

        } catch (Exception e) {
            System.err.println("Error updating preferred username: " + e.getMessage());
            throw new Exception("Failed to update preferred username in Cognito", e);
        }
    }

    /**
     * Updates a user's email in Cognito using their username.
     *
     * @param username the user's username
     * @param newEmail the new email
     * @throws Exception if the update fails
     */
    public void updateEmail(String username, String newEmail) throws Exception {
        try {
            AdminGetUserRequest getUserRequest = AdminGetUserRequest.builder()
                    .username(username)
                    .userPoolId(userPoolId)
                    .build();

            AdminGetUserResponse getUserResponse = cognitoClient.adminGetUser(getUserRequest);

            System.out.println("User retrieved from Cognito: " + getUserResponse.username());

            AttributeType emailAttribute = AttributeType.builder()
                    .name("email")
                    .value(newEmail)
                    .build();

            AdminUpdateUserAttributesRequest updateRequest = AdminUpdateUserAttributesRequest.builder()
                    .userPoolId(userPoolId)
                    .username(username)
                    .userAttributes(emailAttribute)
                    .build();

            cognitoClient.adminUpdateUserAttributes(updateRequest);

            System.out.println("Email updated successfully to: " + newEmail);

        } catch (Exception e) {
            System.err.println("Error updating email: " + e.getMessage());
            throw new Exception("Failed to update email in Cognito", e);
        }
    }

    /**
     * Changes a user's password in Cognito using their username.
     *
     * @param username the user's username
     * @param oldPassword the current password
     * @param newPassword the new password
     * @throws Exception if the password change fails
     */
    public void changePassword(String username, String oldPassword, String newPassword) throws Exception {
        try {
            AdminGetUserRequest getUserRequest = AdminGetUserRequest.builder()
                    .username(username)
                    .userPoolId(userPoolId)
                    .build();

            AdminGetUserResponse getUserResponse = cognitoClient.adminGetUser(getUserRequest);

            System.out.println("User retrieved from Cognito: " + getUserResponse.username());

            String accessToken = "RETRIEVE_THE_ACCESS_TOKEN_FOR_THE_USER";

            ChangePasswordRequest request = ChangePasswordRequest.builder()
                    .accessToken(accessToken)
                    .previousPassword(oldPassword)
                    .proposedPassword(newPassword)
                    .build();

            cognitoClient.changePassword(request);

            System.out.println("Password changed successfully.");

        } catch (Exception e) {
            System.err.println("Error changing password: " + e.getMessage());
            throw new Exception("Failed to change password in Cognito", e);
        }
    }

     /**
     * Deletes a user account from AWS Cognito.
     * @param username the username of the account to delete
     * @throws Exception if the deletion fails
     */
    public void deleteUserFromCognito(String username) throws Exception {
        try {
            AdminDeleteUserRequest deleteUserRequest = AdminDeleteUserRequest.builder()
                    .userPoolId(userPoolId)
                    .username(username)
                    .build();

            AdminDeleteUserResponse deleteUserResponse = cognitoClient.adminDeleteUser(deleteUserRequest);

        } catch (CognitoIdentityProviderException e) {
            throw new Exception("Failed to delete user from Cognito: " + e.awsErrorDetails().errorMessage(), e);
        }
    }
}