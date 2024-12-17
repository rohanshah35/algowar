package com.nodewars.service;

import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.nodewars.utils.CognitoUtils;

@Service
public class CognitoService {

    private final CognitoIdentityProviderClient cognitoClient;
    // @Value("${AWS_COGNITO_CLIENT_ID}")
    private String clientId = "5e4jldap6ts7jifjfnhdibgmlk";

    public CognitoService() {
        this.cognitoClient = CognitoIdentityProviderClient.builder()
            .region(Region.US_WEST_1) // Change to your region
            .credentialsProvider(ProfileCredentialsProvider.create())
            .build();
    }

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
}
