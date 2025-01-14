package com.nodewars.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.lambda.LambdaClient;
import software.amazon.awssdk.services.lambda.model.InvokeRequest;
import software.amazon.awssdk.services.lambda.model.InvokeResponse;
import software.amazon.awssdk.core.SdkBytes;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

/**
 * Service class for managing compilation operations.
 * This class provides methods for code output retrieval and tests.
 */

 @Service
 public class CompilerService {

    private final LambdaClient lambdaClient;

    @Value("${aws.lambda.python.function-name}")
    private String lambdaFunctionName;

    /**
     * Constructs a new CompilerService with a LambdaClient.
     */
    public CompilerService(
        @Value("${aws.credentials.access-key-id}") String accessKeyId,
        @Value("${aws.credentials.secret-access-key}") String secretAccessKey,
        @Value("${aws.region}") String region
    ) {
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKeyId, secretAccessKey);
        this.lambdaClient = LambdaClient.builder()
            .region(Region.of(region))
            .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
            .build();
    }
 
     public String compileAndRun(String language, String code, String harnessCode, Object testCases) throws Exception {
         Map<String, Object> payload = Map.of(
             "user_code", code,
             "harness_code", harnessCode,
             "test_cases", testCases
         );
 
         String jsonPayload = new ObjectMapper().writeValueAsString(payload);
 
         InvokeRequest invokeRequest = InvokeRequest.builder()
             .functionName(lambdaFunctionName)
             .payload(SdkBytes.fromUtf8String(jsonPayload))
             .build();
 
         InvokeResponse response = lambdaClient.invoke(invokeRequest);
 
         if (response.statusCode() == 200) {
             String result = response.payload().asUtf8String();
             return result;
         } else {
             throw new RuntimeException("Lambda invocation failed with status code: " + response.statusCode());
         }
     }
 }
