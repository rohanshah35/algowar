package com.nodewars.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Lob;
import java.util.List;

/**
 * Represents a problem entity in the database.
 * This class contains problem information such as title, description, difficulty, categories, examples, and more.
 */

@Entity
@Table(name = "problems")
public class Problem {

    @Id
    @Column(name = "id")
    private int id;

    @Column(name = "title")
    private String title;

    @Column(name = "slug", unique = true)
    private String slug;

    @Column(name = "description", length = 10000)
    private String description;

    @Column(name = "difficulty")
    private String difficulty;

    @Column(name = "categories")
    private List<String> categories;

    @Column(name = "examples")
    private String examples;

    @Column(name = "constraints")
    private String constraints;

    @Column(name = "starter_code")
    private String starterCode;

    @Column(name = "test_cases")
    private String testCases;

    @Column(name = "acceptance_rate")
    private double acceptanceRate;

    @Column(name = "total_submissions")
    private int totalSubmissions;

    @Column(name = "accepted_submissions")
    private int acceptedSubmissions;

    public Problem() {}

    public Problem(int id, String title, String slug, String description, String difficulty, List<String> categories,
                   String examples, String constraints, String starterCode, String testCases,
                   double acceptanceRate, int totalSubmissions, int acceptedSubmissions) {
        this.id = id;
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.difficulty = difficulty;
        this.categories = categories;
        this.examples = examples;
        this.constraints = constraints;
        this.starterCode = starterCode;
        this.testCases = testCases;
        this.acceptanceRate = acceptanceRate;
        this.totalSubmissions = totalSubmissions;
        this.acceptedSubmissions = acceptedSubmissions;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public String getExamples() {
        return examples;
    }

    public void setExamples(String examples) {
        this.examples = examples;
    }

    public String getConstraints() {
        return constraints;
    }

    public void setConstraints(String constraints) {
        this.constraints = constraints;
    }

    public String getStarterCode() {
        return starterCode;
    }

    public void setStarterCode(String starterCode) {
        this.starterCode = starterCode;
    }

    public String getTestCases() {
        return testCases;
    }

    public void setTestCases(String testCases) {
        this.testCases = testCases;
    }

    public double getAcceptanceRate() {
        return acceptanceRate;
    }

    public void setAcceptanceRate(double acceptanceRate) {
        this.acceptanceRate = acceptanceRate;
    }

    public int getTotalSubmissions() {
        return totalSubmissions;
    }

    public void setTotalSubmissions(int totalSubmissions) {
        this.totalSubmissions = totalSubmissions;
    }

    public int getAcceptedSubmissions() {
        return acceptedSubmissions;
    }

    public void setAcceptedSubmissions(int acceptedSubmissions) {
        this.acceptedSubmissions = acceptedSubmissions;
    }
}
