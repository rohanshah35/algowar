package com.nodewars.utils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Utility class for AWS Cognito operations.
 */
public class CognitoUtils {

    /**
     * Calculates the secret hash for AWS Cognito.
     *
     * @param username the username of the Cognito user
     * @param clientId the client ID of the Cognito app
     * @param clientSecret the client secret of the Cognito app
     * @return the calculated secret hash as a Base64 encoded string
     *
     */
    public static String calculateSecretHash(String username, String clientId, String clientSecret) {
        try {
            String message = username + clientId;
            SecretKeySpec secretKeySpec = new SecretKeySpec(clientSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error calculating secret hash", e);
        }
    }
}

