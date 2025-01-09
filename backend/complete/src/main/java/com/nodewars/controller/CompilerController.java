package com.nodewars.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nodewars.service.CompilerService;
import com.nodewars.service.ProblemService;

import java.util.List;
import java.util.Map;

/**
 * REST controller for handling code compilation and execution requests.
 *
 * This controller provides an endpoint for clients to submit code,
 * specify the programming language, and include test cases. 
 * It delegates the compilation and execution to the CompilerService, 
 * which interacts with AWS Lambda to run the appropriate function.
 *
 * Supports the following languages:
 * - C
 * - C++
 * - Python2
 * - Python3
 * - Java
 *
 * Handles runtime output, compilation errors, and test case validation.
 */
@RestController
@RequestMapping("/compile")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CompilerController {

    @Autowired
    private CompilerService compilerService;

    @Autowired
    private ProblemService problemService;



    // /**
    //  * Endpoint to compile and run code with specified test cases.
    //  * @param request Request body containing "language", "code", and "testCases".
    //  * @return ResponseEntity containing the result or error message.
    //  */
    // @PostMapping("/code")
    // public ResponseEntity<Map<String, Object>> compileCode(@RequestBody Map<String, Object> request) {
    //     String language = (String) request.get("language");
    //     String code = (String) request.get("code");
    //     String functionName = (String) request.get("functionName");
    //     Object testCases = request.get("testCases");
    
    //     try {
    //         String result = compilerService.compileAndRun(language, code, functionName, testCases);
    
    //         ObjectMapper objectMapper = new ObjectMapper();
    //         @SuppressWarnings("unchecked")
    //         Map<String, Object> resultMap = objectMapper.readValue(result, Map.class);
    
    //         String body = (String) resultMap.get("body");
    
    //         @SuppressWarnings("unchecked")
    //         Map<String, Object> bodyMap = objectMapper.readValue(body, Map.class);

    //         @SuppressWarnings("unchecked")
    //         List<Map<String, Object>> failedTests = (List<Map<String, Object>>) bodyMap.get("failed");
    //         boolean success = failedTests.isEmpty();  // Set success to true if no failed tests

    
    //         Map<String, Object> response = Map.of(
    //             "success", success,
    //             "result", bodyMap
    //         );
    
    //         return ResponseEntity.ok(response);
    
    //     } catch (Exception e) {
    //         // Return a 500 error response with the error message
    //         return ResponseEntity.status(500).body(Map.of(
    //             "success", false,
    //             "error", e.getMessage()
    //         ));
    //     }
    // }

    @PostMapping("/run")
    public ResponseEntity<Map<String, Object>> runCode(@RequestBody Map<String, Object> request) {
        String language = (String) request.get("language");
        String code = (String) request.get("code");
        String slug = (String) request.get("slug");
        Object testCases = request.get("testCases");

        try {
            String harnessCode = problemService.getHarnessCode(slug, language);
            String result = compilerService.compileAndRun(language, code, harnessCode, testCases);

            ObjectMapper objectMapper = new ObjectMapper();
            @SuppressWarnings("unchecked")
            Map<String, Object> resultMap = objectMapper.readValue(result, Map.class);
    
            String body = (String) resultMap.get("body");

    
            Map<String, Object> response = Map.of(
                "result", resultMap
            );
    
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}
