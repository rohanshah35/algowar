package com.nodewars.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.nodewars.service.CompilerService;

import java.util.List;
import java.util.Map;

/**
 * REST controller for handling code compilation and execution requests.
 *
 * This controller provides an endpoint for clients to submit code,
 * specify the programming language, and include test cases. 
 * It delegates the compilation and execution to the CompilerService, 
 * which interacts with AWS ECS to run the appropriate Docker container.
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

    @PostMapping
    public ResponseEntity<Map<String, String>> compileCode(@RequestBody Map<String, Object> request) {
        String language = (String) request.get("language");
        String code = (String) request.get("code");
        List<String> testCases = (List<String>) request.get("testCases");

        try {
            String taskArn = compilerService.compileAndRun(language, code, testCases);
            return ResponseEntity.ok(Map.of("taskArn", taskArn));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
