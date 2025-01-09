package com.nodewars.service;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.nodewars.model.Problem;
import com.nodewars.repository.ProblemRepository;

/**
 * Service class for managing problem-related operations.
 * This class provides methods for problem retrieval and updates.
 */

@Service
public class ProblemService {

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private static final Logger logger = LoggerFactory.getLogger(ProblemService.class);

    /**
     * Fetch all problems.
     * 
     * @return a list of all problems
     */
    public List<Problem> getAllProblems() {
        return problemRepository.findAllProblems();
    }

    /**
     * Checks if a problem exists by its slug.
     * 
     * @param slug the slug of the problem
     * @return true if the problem exists, false otherwise
     */
    public boolean problemExists(String slug) {
        return problemRepository.existsBySlug(slug);
    }

    /**
     * Retrieves a problem by its slug.
     * 
     * @param slug the slug of the problem
     * @return the problem entity
     */
    public Problem getProblemBySlug(String slug) {
        return problemRepository.findBySlug(slug);
    }

    public Map<String, String> getHarnessCodes(String slug) {
        String harnessCodesJSON = problemRepository.getHarnessCode(slug);
        try {
            return objectMapper.readValue(harnessCodesJSON, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse main functions JSON", e);
        }
    }

    public String getHarnessCode(String slug, String language) {
        Map<String, String> harnessCodes = getHarnessCodes(slug);
        return harnessCodes.get(language);
    }

    /**
     * Updates the acceptance rate for a given problem.
     * 
     * @param slug the slug of the problem
     * @param newAcceptanceRate the new acceptance rate
     * @throws Exception if the problem is not found
     */
    @Transactional
    public void updateAcceptanceRate(String slug, double newAcceptanceRate) throws Exception {
        Problem problem = problemRepository.findBySlug(slug);
        if (problem == null) {
            throw new Exception("Problem not found with slug: " + slug);
        }

        problemRepository.updateAcceptanceRate(slug, newAcceptanceRate);
    }

    /**
     * Updates the total submissions for a given problem.
     * 
     * @param slug the slug of the problem
     * @param newTotalSubmissions the new total submissions
     * @throws Exception if the problem is not found
     */
    @Transactional
    public void updateTotalSubmissions(String slug, int newTotalSubmissions) throws Exception {
        Problem problem = problemRepository.findBySlug(slug);
        if (problem == null) {
            throw new Exception("Problem not found with slug: " + slug);
        }

        problemRepository.updateTotalSubmissions(slug, newTotalSubmissions);
    }

    /**
     * Updates the accepted submissions for a given problem.
     * 
     * @param slug the slug of the problem
     * @param newAcceptedSubmissions the new accepted submissions
     * @throws Exception if the problem is not found
     */
    @Transactional
    public void updateAcceptedSubmissions(String slug, int newAcceptedSubmissions) throws Exception {
        Problem problem = problemRepository.findBySlug(slug);
        if (problem == null) {
            throw new Exception("Problem not found with slug: " + slug);
        }

        problemRepository.updateAcceptedSubmissions(slug, newAcceptedSubmissions);
    }
}
