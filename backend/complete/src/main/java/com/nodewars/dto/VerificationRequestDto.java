package com.nodewars.dto;

/**
 * A Data Transfer Object for handling verification requests.
 * This class contains the verification code and the username associated with the request.
 */
public class VerificationRequestDto {
    private String verificationCode;
    private String username;

    public VerificationRequestDto() {
    }

    public VerificationRequestDto(String verificationCode, String username) {
        this.verificationCode = verificationCode;
        this.username = username;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
