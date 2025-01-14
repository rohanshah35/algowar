"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Button, Paper, Text, Loader, Group } from "@mantine/core";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin'], weight: ['300'] });

export default function FriendRequests() {
  const [pendingRequests, setPendingRequests] = useState<{ username: string; profilePicture: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch("http://localhost:8080/user/friend-requests", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setPendingRequests(data.friendRequests || []);
        } else {
          console.error("Failed to fetch pending requests.");
        }
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleAcceptRequest = async (username: string) => {
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch(`http://localhost:8080/user/friends/accept-friend-request/${username}`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setStatusMessage("Friend request accepted successfully!");
        setPendingRequests(prev => prev.filter(request => request.username !== username));
      } else {
        setStatusMessage("Failed to accept friend request. Please try again.");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      setStatusMessage("Error accepting friend request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRequest = async (username: string) => {
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch(`http://localhost:8080/user/friends/decline-friend-request/${username}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setStatusMessage("Friend request rejected.");
        setPendingRequests(prev => prev.filter(request => request.username !== username));
      } else {
        setStatusMessage("Failed to reject friend request. Please try again.");
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      setStatusMessage("Error rejecting friend request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div >
      <Text
        ta="center"
        fz="lg"
        style={{
          fontFamily: inter.style.fontFamily,
          color: "#f4f4f5",
          marginBottom: "2.5rem",
          fontWeight: 400,
        }}
      >
        Friend Requests{" "}
        {pendingRequests.length > 0 && (
          <span
            style={{
              fontWeight: 700,
            }}
          >
            ({pendingRequests.length})
          </span>
        )}
      </Text>

      {pendingRequests.length === 0 ? (
        <Text ta="center" fz="sm" style={{ color: "#a1a1aa" }}>
          You have no pending friend requests.
        </Text>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "60px", paddingLeft: "150px", paddingRight: "150px" }}>
          {pendingRequests.map((request, index) => (
            <Paper
              key={index}
              radius="md"
              withBorder
              p="lg"
              bg="#18181b"
              style={{
                border: "transparent",
                position: "relative",
                boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.5)",
              }}
            >
              <Avatar
                src={request.profilePicture}
                size={120}
                radius={100}
                mx="auto"
              />
              <Text
                ta="center"
                fz="md"
                fw={500}
                mt="sm"
                c="#d4d4d8"
                style={{ fontFamily: inter.style.fontFamily }}
              >
                {request.username}
              </Text>
              <Group mt="md" justify="center">
              <Button
                variant="filled"
                color="green"
                size="sm"
                onClick={() => handleAcceptRequest(request.username)}
                disabled={isLoading}
                styles={{
                  root: {
                    backgroundColor: "#14532d",
                    color: "#ffffff",
                    fontWeight: 300,
                  },
                }}
              >
                {isLoading ? <Loader size="sm" color="white" /> : "Accept"}
              </Button>
              <Button
                variant="filled"
                color="red"
                size="sm"
                onClick={() => handleRejectRequest(request.username)}
                disabled={isLoading}
                styles={{
                  root: {
                    backgroundColor: "#7f1d1d",
                    color: "#ffffff",
                    fontWeight: 300,
                  },
                }}
              >
                {isLoading ? <Loader size="sm" color="white" /> : "Reject"}
              </Button>
            </Group>
              {statusMessage && (
                <Text
                  ta="center"
                  fz="sm"
                  c={statusMessage.includes("failed") ? "red" : "green"}
                  mt="sm"
                >
                  {statusMessage}
                </Text>
              )}
            </Paper>
          ))}
        </div>
      )}
    </div>
  );
}
