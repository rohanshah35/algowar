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
import { GetServerSideProps } from "next";

export function LoginForm() {
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

    const formData = new FormData(event.currentTarget);
    const payload = {
      username: formData.get("identifier"),
      password: formData.get("password"),
    };
    try {
      console.log("All cookies from the current domain:", document.cookie);
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      console.log("All cookies from the current domain:", document.cookie);

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      console.log("Login successful:", data);
      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        router.push("/");
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
          shadow="lg"
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
              mb="xs"
              style={{
                color: "#d4d4d8",
                fontWeight: 600,
              }}
            >
              Login
            </Title>
            <Text size="xs" style={{ color: "#a1a1aa" }}>
              Sign in to your account.
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
            name="identifier"
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
            Login
          </Button>
        </Card>

        <Text size="xs" ta="center" mt="md" style={{ color: "#a1a1aa" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup">
            <Text
              component="span"
              variant="link"
              inherit
              style={{ color: "#3b82f6" }}
            >
              Sign Up
            </Text>
          </Link>
        </Text>
      </form>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch("http://localhost:8080/auth/check-auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Include cookies in the request
  });

  if (res.ok) {
    // If authenticated, redirect to the homepage
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // If not authenticated, allow the page to render
  return { props: {} };
};
