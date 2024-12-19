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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/check-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Not authenticated.");
        }

        console.log("Authenticated.");
        router.push("/");
      } catch (err: any) {
        console.log(err);
      }
    }

    checkAuth();
  }, [router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

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
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Signup failed. Please try again.");
      }

      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => {
        router.push(`/verification?username=${payload.username}&password=${payload.password}`);
      }, 2000);
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
          <Box style={{ textAlign: "center", marginBottom: "1.5rem" }}>
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
            <Text size="xs" style={{ color: "#a1a1aa" }}>
              Create your new account.
            </Text>
          </Box>

          <TextInput
            label={
              <span
                style={{
                  color: "#d4d4d8",
                  fontSize: "11px",
                  fontWeight: "700",
                }}
              >
                USERNAME
              </span>
            }
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
            label={
              <span
                style={{
                  color: "#d4d4d8",
                  fontSize: "11px",
                  fontWeight: "700",
                }}
              >
                EMAIL
              </span>
            }
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
            label={
              <span
                style={{
                  color: "#d4d4d8",
                  fontSize: "11px",
                  fontWeight: "700",
                }}
              >
                PASSWORD
              </span>
            }
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

        {error && (
        <Text size="sm" mt="xs" style={{ color: "#f87171", textAlign: "center" }}>
          {error}
        </Text>
          )}
          {success && (
            <Text size="sm" mt="xs" style={{ color: "#34d399", textAlign: "center" }}>
              {success}
            </Text>
          )}

          <Button
            type="submit"
            fullWidth
            mt="md"
            loading={loading}
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

        <Text size="xs" ta="center" mt="md" style={{ color: "#a1a1aa" }}>
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
