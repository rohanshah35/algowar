package com.nodewars;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.reactive.ReactiveSecurityAutoConfiguration;

/**
 * The main entry point for the NodeWars application.
 * This class is annotated with @SpringBootApplication to indicate a Spring Boot application.
 * It excludes the ReactiveSecurityAutoConfiguration class from auto-configuration.
 * 
 * @author Luca Bianchini
 * @author Rohan Shah
 */
@SpringBootApplication(exclude = {ReactiveSecurityAutoConfiguration.class})
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

