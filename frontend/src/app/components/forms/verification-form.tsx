"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Card, Title, Text, Button, Box, PinInput, Flex } from "@mantine/core";

export function VerificationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const username = searchParams.get("username") || "";
  const password = searchParams.get("password") || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleVerification = async () => {
    console.log(code);
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        username: username,
        password: password,
        verificationCode: code,
      };

      const response = await fetch("http://localhost:8080/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Verification failed. Please check the code.");
      }

      setSuccess("Verification successful! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = { username };

      const response = await fetch(
        "http://localhost:8080/auth/resend-verification-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resend verification code. Please try again.");
      }

      setSuccess("Verification code resent successfully!");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setResending(false);
    }
  };

  return (
    <Box maw={400} mx="auto" w="100%">
      <Card
        padding="xl"
        radius="md"
        withBorder
        style={{
          backgroundColor: "#18181b",
          borderColor: "#27272a",
          color: "#f4f4f5",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)"
        }}
      >

        <Box style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Title
            order={2}
            style={{
              color: "#d4d4d8",
              fontWeight: 600,
              marginBottom: "0.5rem",
            }}
          >
            Verify Your Account
          </Title>
          <Text size="xs" style={{ color: "#a1a1aa" }}>
            A code was sent to your email.
          </Text>
        </Box>

        <Flex justify="center" mb="md">
          <PinInput
            length={6}
            onChange={setCode}
            onComplete={
              (value) => {
                if (value.length === 6) {
                console.log("Submitting verification code...");
                handleVerification();
                }
            }}
            styles={{
              input: {
                backgroundColor: "#27272a",
                color: "#d4d4d8",
                border: "1px solid #3f3f46",
                borderRadius: "4px",
              },
            }}
          />
        </Flex>

        {error && (
          <Text size="sm" color="red" mb="xs" ta="center">
            {error}
          </Text>
        )}

        {success && (
          <Text size="sm" color="green" mb="xs" ta="center">
            {success}
          </Text>
        )}

        <Button
          fullWidth
          mt="md"
          onClick={handleVerification}
          loading={loading}
          style={{
            backgroundColor: "#27272a",
            color: "#d4d4d8",
            border: "1px solid #3f3f46",
            borderRadius: "4px",
          }}
          radius="sm"
        >
          Verify
        </Button>
      </Card>

      <Text size="sm" ta="center" mt="md" style={{ color: "#a1a1aa" }}>
        Didn&apos;t receive the code?{" "}
        <Text
          component="span"
          variant="link"
          inherit
          style={{ color: "#3b82f6", cursor: "pointer" }}
          onClick={handleResendVerification}
        >
          Resend Code
        </Text>
      </Text>
    </Box>
  );
}
