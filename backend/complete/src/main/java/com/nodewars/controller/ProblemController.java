package com.nodewars.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

import com.nodewars.service.ProblemService;
import com.nodewars.model.Problem;

/**
 * REST controller for managing problems.
 * 
 * This controller provides endpoints for fetching and updating problems.
 * Endpoints include fetching problems by slug and updating specific fields.
 */
@RestController
@RequestMapping("/problem")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProblemController {

    private static final Logger logger = LoggerFactory.getLogger(ProblemController.class);

    @Autowired
    private ProblemService problemService;

    /**
     * Endpoint to get all problems.
     * 
     * @return a list of all problems
     */
    @GetMapping("/all")
    public ResponseEntity<List<Problem>> getAllProblems() {
        try {
            List<Problem> problems = problemService.getAllProblems();

            List<Problem> sanitizedProblems = problems.stream()
                .map(problem -> {
                    problem.setTestCases(null);
                    return problem;
                })
                .toList();

            return ResponseEntity.ok(sanitizedProblems);
        } catch (Exception e) {
            logger.error("Error fetching all problems: {}", e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }


    /**
     * Endpoint to fetch a problem by its slug.
     * 
     * @param slug the slug of the problem
     * @return the problem entity
     */
    @GetMapping("/{slug}")
    public ResponseEntity<Problem> getProblemBySlug(@PathVariable String slug) {
        try {
            Problem problem = problemService.getProblemBySlug(slug);
            if (problem == null) {
                return ResponseEntity.notFound().build();
            }
            problem.setTestCases(null);
            return ResponseEntity.ok(problem);
        } catch (Exception e) {
            logger.error("Error fetching problem by slug: {}", e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Endpoint to check if a problem exists by its slug.
     * 
     * @param slug the slug of the problem
     * @return a map containing the existence status
     */
    @GetMapping("/exists/{slug}")
    public ResponseEntity<Map<String, String>> checkProblemExists(@PathVariable String slug) {
        Map<String, String> response = new HashMap<>();
        try {
            boolean exists = problemService.problemExists(slug);
            response.put("exists", String.valueOf(exists));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error checking problem existence: {}", e.getMessage());
            response.put("error", "An error occurred while checking problem existence.");
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Endpoint to update acceptance rate for a problem.
     * 
     * @param slug the slug of the problem
     * @param request containing the new acceptance rate
     * @return success or error message
     */
    @PutMapping("/update/acceptance-rate/{slug}")
    public ResponseEntity<Map<String, String>> updateAcceptanceRate(
            @PathVariable String slug, @RequestBody Map<String, Double> request) {
        Map<String, String> response = new HashMap<>();
        try {
            double newAcceptanceRate = request.get("acceptanceRate");
            problemService.updateAcceptanceRate(slug, newAcceptanceRate);
            response.put("message", "Acceptance rate updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error updating acceptance rate: {}", e.getMessage());
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Endpoint to update total submissions for a problem.
     * 
     * @param slug the slug of the problem
     * @param request containing the new total submissions
     * @return success or error message
     */
    @PutMapping("/update/total-submissions/{slug}")
    public ResponseEntity<Map<String, String>> updateTotalSubmissions(
            @PathVariable String slug, @RequestBody Map<String, Integer> request) {
        Map<String, String> response = new HashMap<>();
        try {
            int newTotalSubmissions = request.get("totalSubmissions");
            problemService.updateTotalSubmissions(slug, newTotalSubmissions);
            response.put("message", "Total submissions updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error updating total submissions: {}", e.getMessage());
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Endpoint to update accepted submissions for a problem.
     * 
     * @param slug the slug of the problem
     * @param request containing the new accepted submissions
     * @return success or error message
     */
    @PutMapping("/update/accepted-submissions/{slug}")
    public ResponseEntity<Map<String, String>> updateAcceptedSubmissions(
            @PathVariable String slug, @RequestBody Map<String, Integer> request) {
        Map<String, String> response = new HashMap<>();
        try {
            int newAcceptedSubmissions = request.get("acceptedSubmissions");
            problemService.updateAcceptedSubmissions(slug, newAcceptedSubmissions);
            response.put("message", "Accepted submissions updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error updating accepted submissions: {}", e.getMessage());
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
