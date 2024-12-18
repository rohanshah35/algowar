"use client";

import { useState } from "react";
import {
  Card,
  Title,
  Text,
  Button,
  Box,
  PinInput,
  Flex,
} from "@mantine/core";

export function VerificationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");

  const handleVerification = async () => {
    setLoading(true);
    setError(null);

    const payload = { code };

    try {
      const response = await fetch("http://localhost:8080/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Verification failed. Please check the code.");
      }

      const data = await response.json();
      console.log("Verification successful:", data);
      // Redirect or handle success here
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
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
        {/* Centered Title */}
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

        {/* Centered PinInput */}
        <Flex justify="center" mb="md">
          <PinInput
            length={6}
            onChange={setCode}
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

        {/* Centered Verify Button */}
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

      {/* Centered Footer Text */}
      <Text size="sm" ta="center" mt="md" style={{ color: "#a1a1aa" }}>
        Didn&apos;t receive the code?{" "}
        <Text
          component="span"
          variant="link"
          inherit
          style={{ color: "#3b82f6", cursor: "pointer" }}
          onClick={() => console.log("Resend Code")}
        >
          Resend Code
        </Text>
      </Text>
    </Box>
  );
}
