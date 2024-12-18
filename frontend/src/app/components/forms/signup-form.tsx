"use client";

import Link from "next/link";
import {
  Card,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Box,
} from "@mantine/core";
import { useState } from "react";

export function SignupForm() {
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Signup failed. Please try again.");
      }

      const data = await response.json();
      console.log("Signup successful:", data);
      // Redirect or handle success here
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maw={400} mx="auto" w="100%">
      <form onSubmit={handleSubmit}>
        <Card
          shadow="lg"
          padding="xl"
          radius="md"
          withBorder
          style={{
            backgroundColor: "#18181b",
            borderColor: "#27272a",
            color: "#f4f4f5",
          }}
        >
          <Title
            order={2}
            mb="xs"
            style={{
              color: "#d4d4d8",
              fontWeight: 600,
            }}
          >
            Sign Up
          </Title>
          <Text size="sm" mb="xl" style={{ color: "#a1a1aa" }}>
            Enter your details to create a new account
          </Text>

          <TextInput
            label={<span style={{ color: "#d4d4d8", fontSize: "11px", fontWeight: "700" }}>USERNAME</span>}
            id="username"
            name="username"
            required
            mb="md"
            styles={{
              input: {
                backgroundColor: "#27272a",
                color: "#d4d4d8",
                border: "1px solid #3f3f46",
                borderRadius: "4px",
              },
              label: { color: "#f4f4f5" },
            }}
          />

          <TextInput
            label={<span style={{ color: "#d4d4d8", fontSize: "11px", fontWeight: "700"   }}>EMAIL</span>}
            id="email"
            name="email"
            type="email"
            required
            mb="md"
            styles={{
              input: {
                backgroundColor: "#27272a",
                color: "#d4d4d8",
                border: "1px solid #3f3f46",
                borderRadius: "4px",
              },
              label: { color: "#f4f4f5" },
            }}
          />

          <PasswordInput
            label={<span style={{ color: "#d4d4d8", fontSize: "11px", fontWeight: "700"   }}>PASSWORD</span>}
            id="password"
            name="password"
            required
            mb="md"
            styles={{
              input: {
                backgroundColor: "#27272a",
                color: "#d4d4d8",
                border: "1px solid #3f3f46",
                borderRadius: "4px",
              },
              label: { color: "#f4f4f5" },
            }}
          />

          <Button
            type="submit"
            fullWidth
            mt="md"
            style={{
              backgroundColor: "#27272a",
              color: "#d4d4d8",
              border: "1px solid #3f3f46",
              borderRadius: "4px",
            }}
            radius="sm"
          >
            Sign Up
          </Button>
        </Card>

        <Text size="sm" ta="center" mt="md" style={{ color: "#a1a1aa" }}>
          Have an account?{" "}
          <Link href="/login">
            <Text
              component="span"
              variant="link"
              inherit
              style={{ color: "#3b82f6" }}
            >
              Login
            </Text>
          </Link>
        </Text>
      </form>
    </Box>
  );
}
