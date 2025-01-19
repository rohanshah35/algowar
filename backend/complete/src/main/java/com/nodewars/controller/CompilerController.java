package com.nodewars.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nodewars.service.CompilerService;
import com.nodewars.service.ProblemService;

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

    private static final Logger logger = LoggerFactory.getLogger(CompilerController.class);

    @Autowired
    private CompilerService compilerService;

    @Autowired
    private ProblemService problemService;

    /**
     * Endpoint to compile and execute user-submitted code with test cases.
     * Delegates code execution to AWS Lambda via CompilerService.
     * @param request Map containing "language", "code", "slug", and "testCases".
     * @return ResponseEntity with execution results or error details.
     */
    @PostMapping("/run")
    public ResponseEntity<Map<String, Object>> runCode(@RequestBody Map<String, Object> request) {
        String language = (String) request.get("language");
        String code = (String) request.get("code");
        String slug = (String) request.get("slug");
    
        try {
            String harnessCode = problemService.getHarnessCode(slug, language);
            logger.info("Harness code: " + harnessCode);

            String shownTestCasesJson = problemService.getFirstThreeTestCases(slug);
            logger.info("Fetched first three test cases: " + shownTestCasesJson);

            ObjectMapper objectMapper = new ObjectMapper();
            Object testCases = objectMapper.readValue(shownTestCasesJson, Object.class);

            String result = compilerService.compileAndRun(language, code, harnessCode, testCases);
            logger.info("Result: " + result);

            @SuppressWarnings("unchecked")
            Map<String, Object> resultMap = objectMapper.readValue(result, Map.class);
            return ResponseEntity.ok(resultMap);
    
        } catch (Exception e) {
            logger.error("Error during code execution", e);
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    /**
     * Endpoint to submit user-submitted code with test cases.
     * Delegates code execution to AWS Lambda via CompilerService.
     * @param request Map containing "language", "code", "slug".
     * @return ResponseEntity with execution results or error details.
     */
    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitCode(@RequestBody Map<String, Object> request) {
        String language = (String) request.get("language");
        String code = (String) request.get("code");
        String slug = (String) request.get("slug");
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> resultMap;
    
        try {
            String harnessCode = problemService.getHarnessCode(slug, language);
            logger.info("Harness code: " + harnessCode);
    
            String shownTestCasesJson = problemService.getTestCases(slug);
            logger.info("Fetched test cases: " + shownTestCasesJson);
    
            Object testCases = objectMapper.readValue(shownTestCasesJson, Object.class);
    
            String result = compilerService.compileAndRun(language, code, harnessCode, testCases);
    
            resultMap = objectMapper.readValue(result, Map.class);
            resultMap.remove("results");
    
            logger.info(resultMap.toString());
    
            boolean allPassed = (Boolean) resultMap.getOrDefault("all_passed", false);
    
            if (allPassed) {
                int newAcceptedSubmissions = problemService.getAcceptedSubmissions(slug) + 1;
                problemService.updateAcceptedSubmissions(slug, newAcceptedSubmissions);
            }
    
            return ResponseEntity.ok(resultMap);
    
        } catch (Exception e) {
            logger.error("Error during code execution", e);
            resultMap = Map.of(
                "success", false,
                "error", e.getMessage()
            );
            return ResponseEntity.status(500).body(resultMap);
    
        } finally {
            try {
                int newTotalSubmissions = problemService.getTotalSubmissions(slug) + 1;
                problemService.updateTotalSubmissions(slug, newTotalSubmissions);
                double newAcceptanceRate = problemService.getAcceptedSubmissions(slug) / (double) problemService.getTotalSubmissions(slug);
                problemService.updateAcceptanceRate(slug, newAcceptanceRate * 100);
            } catch (Exception updateException) {
                logger.error("Error updating total submissions or acceptance rate", updateException);
            }
        }
    }
    
}
