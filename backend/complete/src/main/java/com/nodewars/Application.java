package com.nodewars;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.reactive.ReactiveSecurityAutoConfiguration;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication(exclude = {ReactiveSecurityAutoConfiguration.class})
public class Application {
    
    @SuppressWarnings("unused")
    public static void main(String[] args) {
        // loading the .env into environment variables
        Dotenv dotenv = Dotenv.configure().load();
        
        // load rds postgres creds
        String dbUrl = dotenv.get("DB_URL");
        String dbUsername = dotenv.get("DB_USERNAME");
        String dbPassword = dotenv.get("DB_PASSWORD");

        // load cognito creds
        String userPoolId = dotenv.get("AWS_COGNITO_USER_POOL_ID");
        String clientId = dotenv.get("AWS_COGNITO_CLIENT_ID");
        String clientSecret = dotenv.get("AWS_COGNITO_CLIENT_SECRET");
        
        // load region
        String region = dotenv.get("AWS_REGION");

        SpringApplication.run(Application.class, args);
    }
}

