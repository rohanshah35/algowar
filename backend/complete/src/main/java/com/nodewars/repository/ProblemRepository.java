package com.nodewars.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.nodewars.model.Problem;

/**
 * JPA Repository interface for Problem entity operations.
 * 
 * This repository provides database operations for querying and updating problems.
 */

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Integer> {

    // Query to get all problems

    @Query("SELECT p FROM Problem p")
    List<Problem> findAllProblems();

    // Query to find a problem by its slug
    
    @Query("SELECT p FROM Problem p WHERE p.slug = :slug")
    Problem findBySlug(@Param("slug") String slug);
    boolean existsBySlug(String slug);

    // Query to pull harness code for problem

    @Query("SELECT p.harnessCode FROM Problem p WHERE p.slug = :slug")
    String getHarnessCode(@Param("slug") String slug);

    // Query to pull test cases for problem

    @Query(value = "SELECT test_cases FROM problems WHERE slug = :slug", nativeQuery = true)    
    String getTestCases(@Param("slug") String slug);

    // Query to pull first three test cases for problem

    @Query(value = "SELECT jsonb_agg(elem) FROM (SELECT jsonb_array_elements(test_cases) AS elem FROM problems WHERE slug = :slug LIMIT 3) AS limited_test_cases", nativeQuery = true)
    String getFirstThreeTestCases(@Param("slug") String slug);
    
    // Update queries

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE Problem p SET p.testCases = :testCases WHERE p.slug = :slug")
    void updateTestCases(@Param("slug") String slug, @Param("testCases") String testCases);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE Problem p SET p.acceptanceRate = :acceptanceRate WHERE p.slug = :slug")
    void updateAcceptanceRate(@Param("slug") String slug, @Param("acceptanceRate") double acceptanceRate);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE Problem p SET p.totalSubmissions = :totalSubmissions WHERE p.slug = :slug")
    void updateTotalSubmissions(@Param("slug") String slug, @Param("totalSubmissions") int totalSubmissions);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE Problem p SET p.acceptedSubmissions = :acceptedSubmissions WHERE p.slug = :slug")
    void updateAcceptedSubmissions(@Param("slug") String slug, @Param("acceptedSubmissions") int acceptedSubmissions);
}
