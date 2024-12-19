package com.nodewars.utils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import com.nimbusds.jose.*;
import com.nimbusds.jwt.*;
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

    /**
     * Verifies the JWT token from AWS Cognito.
     * @param token the JWT token to verify
     * @return true if the token is valid, false otherwise
     * @throws IOException
     */
    public static boolean verifyToken(String token) throws IOException {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            
            JWSHeader header = signedJWT.getHeader();
            String keyId = header.getKeyID();

            URL jwksUrl = new URL("https://cognito-idp.us-west-1.amazonaws.com/us-west-1_CIZV2e5aH/.well-known/jwks.json");
            JWKSet jwks = JWKSet.load(jwksUrl);

            JWK jwk = jwks.getKeyByKeyId(keyId);
            RSAKey rsaKey = (RSAKey) jwk;
            RSAPublicKey publicKey = rsaKey.toRSAPublicKey();

            RSASSAVerifier verifier = new RSASSAVerifier(publicKey);
            if (!signedJWT.verify(verifier)) {
                return false;
            }

            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
            
            Date expirationTime = claims.getExpirationTime();
            if (expirationTime != null && expirationTime.before(new Date())) {
                return false;
            }
            
            String audience = claims.getAudience().get(0);
            if (!audience.equals("5e4jldap6ts7jifjfnhdibgmlk")) {
                return false; 
            }

            String issuer = claims.getIssuer();
            if (!issuer.equals("https://cognito-idp.us-west-1.amazonaws.com/us-west-1_CIZV2e5aH")) {
                return false; 
            }

            return true; 
        } catch (JOSEException | java.text.ParseException e) {
            e.printStackTrace();
            return false; 
        }
    }
}

