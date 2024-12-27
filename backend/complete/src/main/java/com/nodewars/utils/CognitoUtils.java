package com.nodewars.utils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import com.nimbusds.jose.*;
import com.nimbusds.jwt.*;
import com.nodewars.model.User;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;

import java.io.IOException;
import java.net.URL;
import java.security.interfaces.RSAPublicKey;
import java.util.Date;

/**
 * Utility class for AWS Cognito operations.
 */
@Component
public class CognitoUtils {

    private final Logger logger = LoggerFactory.getLogger(CognitoUtils.class);

    @Value("${aws.credentials.access-key-id}")
    private String accessKeyId;

    @Value("${aws.credentials.secret-access-key}")
    private String secretAccessKey;

    @Value("${aws.cognito.jwks-url}")
    private String jwksUrl;

    @Value("${aws.cognito.client-id}")
    private String clientId;

    @Value("${aws.cognito.client-secret}")
    private String clientSecret;

    @Value("${aws.cognito.user-pool-id}")
    private String userPoolId;

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

    /**
     * Verifies the JWT token from AWS Cognito.
     * @param token the JWT token to verify
     * @return true if the token is valid, false otherwise
     * @throws IOException
     */
    public User verifyAndGetUser(String token) throws IOException {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            
            JWSHeader header = signedJWT.getHeader();
            String keyId = header.getKeyID();

            URL jwksUrl = new URL(this.jwksUrl);
            JWKSet jwks = JWKSet.load(jwksUrl);

            JWK jwk = jwks.getKeyByKeyId(keyId);
            RSAKey rsaKey = (RSAKey) jwk;
            RSAPublicKey publicKey = rsaKey.toRSAPublicKey();

            RSASSAVerifier verifier = new RSASSAVerifier(publicKey);
            if (!signedJWT.verify(verifier)) {
                throw new RuntimeException("Invalid token");
            }

            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
            
            Date expirationTime = claims.getExpirationTime();
            if (expirationTime != null && expirationTime.before(new Date())) {
                throw new RuntimeException("Token expired");
            }
            
            String audience = claims.getAudience().get(0);
            if (!audience.equals(this.clientId)) {
                throw new RuntimeException("Invalid audience");
            }

            String issuer = claims.getIssuer();
            if (!issuer.equals("https://cognito-idp.us-west-1.amazonaws.com/" + this.userPoolId)) {
                throw new RuntimeException("Invalid issuer");
            }

            logger.info("Token verified: " + claims.toString());

            User user = new User(claims.getStringClaim("email"), claims.getStringClaim("sub"), claims.getStringClaim("cognito:username"), claims.getStringClaim("preferred_username"), claims.getBooleanClaim("email_verified"));
            return user;
        } catch (JOSEException | java.text.ParseException | RuntimeException e) {
            e.printStackTrace();
            logger.error("Error verifying token", e);
            throw new RuntimeException("Error verifying token", e);
        }
    }
}
