package com.nodewars.service;

import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.nodewars.utils.CognitoUtils;

/**
 * Service class for handling AWS Cognito operations such as sign-up, login, and email verification.
 */
@Service
public class CognitoService {

    private final CognitoIdentityProviderClient cognitoClient;
    private static final Logger logger = LoggerFactory.getLogger(CognitoService.class);
    private String clientId = "5e4jldap6ts7jifjfnhdibgmlk";

    /**
     * Constructs a new CognitoService with a CognitoIdentityProviderClient.
     */
    public CognitoService() {
        this.cognitoClient = CognitoIdentityProviderClient.builder()
            .region(Region.US_WEST_1) // Change to your region
            .credentialsProvider(ProfileCredentialsProvider.create())
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
        String secretHash = CognitoUtils.calculateSecretHash(username, clientId, "1csiofdpf93nlccpf7dhlsssqa5ovhovfr0k16v4uqagg032deco");
        SignUpRequest request = SignUpRequest.builder()
            .clientId(clientId)
            .username(username)
            .password(password)
            .userAttributes(
                AttributeType.builder().name("email").value(email).build()
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
        String secretHash = CognitoUtils.calculateSecretHash(username, clientId, "1csiofdpf93nlccpf7dhlsssqa5ovhovfr0k16v4uqagg032deco");

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
        String secretHash = CognitoUtils.calculateSecretHash(username, clientId, "1csiofdpf93nlccpf7dhlsssqa5ovhovfr0k16v4uqagg032deco");
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
        String secretHash = CognitoUtils.calculateSecretHash(username, clientId, "1csiofdpf93nlccpf7dhlsssqa5ovhovfr0k16v4uqagg032deco");
        ResendConfirmationCodeRequest request = ResendConfirmationCodeRequest.builder()
            .clientId(clientId)
            .username(username)
            .secretHash(secretHash)
            .build();

        cognitoClient.resendConfirmationCode(request);
    }
}