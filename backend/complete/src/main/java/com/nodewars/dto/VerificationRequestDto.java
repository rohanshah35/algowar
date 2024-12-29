package com.nodewars.dto;

/**
 * Data Transfer Object for handling verification requests.
 * This class contains the verification code and the username associated with the request.
 */
public class VerificationRequestDto {
    private String verificationCode;
    private String userSub;

    public VerificationRequestDto() {
    }

    public VerificationRequestDto(String verificationCode, String userSub) {
        this.verificationCode = verificationCode;
        this.userSub = userSub;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public String getUserSub() {
        return userSub;
    }

    public void setUserSub(String userSub) {
        this.userSub = userSub;
    }
}
