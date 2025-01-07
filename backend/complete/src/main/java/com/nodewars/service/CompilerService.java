package com.nodewars.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.ecs.EcsClient;
import software.amazon.awssdk.services.ecs.model.*;

import java.util.List;

/**
 * Service class for managing compilation operations.
 * This class provides methods for code output retrieval and tests.
 */

@Service
public class CompilerService {

    private final EcsClient ecsClient;

    @Value("${aws.ecs.cluster-name}")
    private String clusterName;

    @Value("${aws.ecs.subnet-id}")
    private String subnetId;

    @Value("${aws.ecs.task.c}")
    private String cTaskDefinition;

    @Value("${aws.ecs.task.cpp}")
    private String cppTaskDefinition;

    @Value("${aws.ecs.task.python2}")
    private String python2TaskDefinition;

    @Value("${aws.ecs.task.python3}")
    private String python3TaskDefinition;

    @Value("${aws.ecs.task.java}")
    private String javaTaskDefinition;

    public CompilerService(@Value("${aws.cognito.region}") String region) {
        this.ecsClient = EcsClient.builder().region(software.amazon.awssdk.regions.Region.of(region)).build();
    }

    public String compileAndRun(String language, String code, List<String> testCases) {
        String taskDefinition = getTaskDefinitionForLanguage(language);
        String inputFilesCommand = generateInputFilesCommand(code, testCases);

        try {
            RunTaskRequest runTaskRequest = RunTaskRequest.builder()
                    .cluster(clusterName)
                    .taskDefinition(taskDefinition)
                    .networkConfiguration(NetworkConfiguration.builder()
                            .awsvpcConfiguration(AwsVpcConfiguration.builder()
                                    .subnets(subnetId)
                                    .assignPublicIp(AssignPublicIp.ENABLED)
                                    .build())
                            .build())
                    .overrides(TaskOverride.builder()
                            .containerOverrides(ContainerOverride.builder()
                                    .name("compiler-container")
                                    .command("sh", "-c", inputFilesCommand)
                                    .build())
                            .build())
                    .launchType(LaunchType.FARGATE)
                    .build();

            RunTaskResponse response = ecsClient.runTask(runTaskRequest);
            return response.tasks().get(0).taskArn();
        } catch (Exception e) {
            throw new RuntimeException("Failed to start ECS task", e);
        }
    }

    private String getTaskDefinitionForLanguage(String language) {
        switch (language.toLowerCase()) {
            case "c": return cTaskDefinition;
            case "cpp": return cppTaskDefinition;
            case "python2": return python2TaskDefinition;
            case "python3": return python3TaskDefinition;
            case "java": return javaTaskDefinition;
            default: throw new IllegalArgumentException("Unsupported language: " + language);
        }
    }

    private String generateInputFilesCommand(String code, List<String> testCases) {
        StringBuilder command = new StringBuilder();
        command.append("echo '").append(code).append("' > /workspace/Solution;");

        for (int i = 0; i < testCases.size(); i++) {
            command.append("echo 'Test case ").append(i + 1).append(": ").append(testCases.get(i)).append("' >> /workspace/tests;");
        }

        return command.toString();
    }
}
