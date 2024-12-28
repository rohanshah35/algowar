// package com.nodewars.service;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;
// import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
// import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
// import software.amazon.awssdk.core.sync.RequestBody;
// import software.amazon.awssdk.regions.Region;
// import software.amazon.awssdk.services.s3.S3Client;
// import software.amazon.awssdk.services.s3.model.*;
// import java.io.IOException;
// import java.util.UUID;
// @Service
// public class S3Service {
//     private static final Logger logger = LoggerFactory.getLogger(S3Service.class);
//     private final S3Client s3Client;

//    @Value("${aws.credentials.access-key-id}")
//    private String accessKeyId;

// @Value("${aws.credentials.secret-access-key}")
//     private String secretAccessKey;

// @Value("${aws.cognito.region}")
//     private String region;
   
//    @Value("${aws.s3.bucket-name}")
//    private String bucketName;
//     public S3Service(
//        @Value("${aws.credentials.access-key-id}") String accessKeyId,
//        @Value("${aws.credentials.secret-access-key}") String secretAccessKey,
//        @Value("${aws.cognito.region}") String region
//    ) {
//     try {
//         AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKeyId, secretAccessKey);
//         this.s3Client = S3Client.builder()
//             .region(Region.of(region))
//             .credentialsProvider(StaticCredentialsProvider.create(credentials))
//             .build();
//     } catch (Exception e) {
//         logger.info("Error creating S3 client: {}", e.getMessage());
//         throw new RuntimeException("Failed to create S3 client", e);
//     }
//    }
//     public String uploadProfilePicture(String username, MultipartFile file) {
//        try {
//            String fileExtension = getFileExtension(file.getOriginalFilename());
//            String key = String.format("profile-pictures/%s-%s%s", 
//                username, UUID.randomUUID(), fileExtension);
//             PutObjectRequest putObjectRequest = PutObjectRequest.builder()
//                .bucket(bucketName)
//                .key(key)
//                .contentType(file.getContentType())
//                .build();
//             s3Client.putObject(putObjectRequest, 
//                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
//             return key;
//        } catch (IOException e) {
//            logger.error("Error uploading profile picture for user {}: {}", username, e.getMessage());
//            throw new RuntimeException("Failed to upload profile picture", e);
//        }
//    }
//     public void deleteProfilePicture(String key) {
//        try {
//            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
//                .bucket(bucketName)
//                .key(key)
//                .build();
//             s3Client.deleteObject(deleteObjectRequest);
//        } catch (Exception e) {
//            logger.error("Error deleting profile picture {}: {}", key, e.getMessage());
//            throw new RuntimeException("Failed to delete profile picture", e);
//        }
//    }
//     public String getProfilePictureUrl(String key) {
//        try {
//            GetUrlRequest getUrlRequest = GetUrlRequest.builder()
//                .bucket(bucketName)
//                .key(key)
//                .build();
//             return s3Client.utilities().getUrl(getUrlRequest).toString();
//        } catch (Exception e) {
//            logger.error("Error getting profile picture URL for key {}: {}", key, e.getMessage());
//            throw new RuntimeException("Failed to get profile picture URL", e);
//        }
//    }
//     private String getFileExtension(String filename) {
//        return filename.substring(filename.lastIndexOf("."));
//    }
// }
