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

export function SignupForm() {
  return (
    <Box maw={400} mx="auto" w="100%">
      <form>
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
