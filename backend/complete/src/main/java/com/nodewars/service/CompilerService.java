package com.nodewars.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.lambda.LambdaClient;
import software.amazon.awssdk.services.lambda.model.InvokeRequest;
import software.amazon.awssdk.services.lambda.model.InvokeResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

/**
 * Service class for managing compilation operations.
 * This class provides methods for code output retrieval and tests.
 */

 @Service
 public class CompilerService {
 
     @Value("${aws.lambda.python.function-name}")
     private String lambdaFunctionName;
 
     private final LambdaClient lambdaClient;
 
     public CompilerService() {
         this.lambdaClient = LambdaClient.create();
     }
 
     public String compileAndRun(String language, String code, String functionName, Object testCases) throws Exception {
         Map<String, Object> payload = Map.of(
             "language", language,
             "code", code,
             "functionName", functionName,
             "testCases", testCases
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
