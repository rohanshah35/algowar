"use client";
import { Container, Paper, Text, Button, Modal } from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/navigation";
import classes from "./account-forms.module.css";

export function DeleteAccount() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:8080/user/delete", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      setSuccess("Account deleted successfully. Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setModalOpened(false);
    }
  };

  return (
    <Container className={classes.topContainer} size={460} my={30}>
      <Paper
        className={classes.container}
        withBorder
        shadow="md"
        p={30}
        radius="md"
        mt="xl"
      >
        {error && <Text className={classes.errorText}>{error}</Text>}
        {success && <Text className={classes.successText}>{success}</Text>}

        <div className={classes.redButton}>
          <Button
            fullWidth
            className={classes.redButton}
            onClick={() => setModalOpened(true)}
            disabled={loading}
            color="red"
          >
            {loading ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </Paper>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="We're sorry to see you go :("
        centered
        withCloseButton={false}
        overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
        }}
        styles={{
            content: {
                backgroundColor: "#18181b",
                color: "#f4f4f5",
                border: "1px solid #27272a",
                fontFamily: 'Inter, sans-serif',
            },
            header: {
                backgroundColor: "#18181b",
                color: "#f4f4f5",
                borderBottom: "none",
                fontFamily: 'Inter, sans-serif',
            },
            body: {
                fontFamily: 'Inter, sans-serif',
            }
        }}
      >
        <Text size="sm" style={{ color: "#d4d4d8" }}>
            Your account and all associated information will be destroyed forever. Make sure you want
            to do this!
        </Text>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
            <Button
                variant="outline"
                style={{ 
                    borderColor: "#27272a",
                    color: "#f4f4f5",
                    backgroundColor: "transparent",
                    fontWeight: 300
                }}
                onClick={() => setModalOpened(false)}
            >
                Back
            </Button>
            <Button
                style={{ 
                    backgroundColor: "#c04f4f",
                    fontWeight: 300
                 }}
                onClick={handleDeleteAccount}
                disabled={loading}
            >
                {loading ? "Deleting..." : "Delete account"}
            </Button>
        </div>
      </Modal>

    </Container>
  );
}
