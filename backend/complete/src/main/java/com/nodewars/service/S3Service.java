package com.nodewars.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import java.util.UUID;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import java.time.Duration;

/**
 * Service class for managing S3 storage operations.
 * This class provides methods for uploading, deleting, and generating presigned URLs for profile pictures.
 * It uses AWS S3 for storing and retrieving profile pictures.
 */

@Service
public class S3Service {
    
    private static final Logger logger = LoggerFactory.getLogger(S3Service.class);

    private final S3Client s3Client;

    private final S3Presigner presigner;

    @Value("${aws.credentials.access-key-id}")
    private String accessKeyId;

    @Value("${aws.credentials.secret-access-key}")
    private String secretAccessKey;

    @Value("${aws.cognito.region}")
    private String region;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;
    public S3Service(
        @Value("${aws.credentials.access-key-id}") String accessKeyId,
        @Value("${aws.credentials.secret-access-key}") String secretAccessKey,
        @Value("${aws.cognito.region}") String region
   ) {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKeyId, secretAccessKey);
        this.s3Client = S3Client.builder()
            .region(Region.of(region))
            .credentialsProvider(StaticCredentialsProvider.create(credentials))
            .build();

            this.presigner = S3Presigner.builder()
            .region(Region.of(region))
            .credentialsProvider(StaticCredentialsProvider.create(credentials))
            .build();
    }
    public String uploadProfilePicture(String username, MultipartFile file) {
        try {
            String fileExtension = getFileExtension(file.getOriginalFilename());
            String key = String.format("profile-pictures/%s-%s%s", 
               username, UUID.randomUUID(), fileExtension);
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
               .bucket(bucketName)
               .key(key)
               .contentType(file.getContentType())
               .build();
            s3Client.putObject(putObjectRequest, 
               RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            return key;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate upload URL", e);
        }
    }

    public void deleteProfilePicture(String key) {
       try {
           DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
               .bucket(bucketName)
               .key(key)
               .build();
            s3Client.deleteObject(deleteObjectRequest);
       } catch (Exception e) {
           throw new RuntimeException("Failed to delete profile picture", e);
       }
   }
    public String getPreSignedUrl(String key) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(60))
                .getObjectRequest(getObjectRequest)
                .build();

            return presigner.presignGetObject(presignRequest).url().toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate presigned URL", e);
        }
    }

    private String getFileExtension(String filename) {
       return filename.substring(filename.lastIndexOf("."));
   }
}
