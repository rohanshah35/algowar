"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Button, Card, Group, Text, Loader } from "@mantine/core";
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
    <div style={{ padding: "20px" }}>
      <Text ta="center" fz="xl" fw={700} style={{ fontFamily: inter.style.fontFamily, color: "#f4f4f5", fontSize: "2.5rem" }}>
        Pending Friend Requests
      </Text>

      {pendingRequests.length === 0 ? (
        <Text ta="center" fz="sm" style={{ color: "#a1a1aa" }}>
          You have no pending friend requests.
        </Text>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "30px"}}>
          {pendingRequests.map((request, index) => (
            <Card
              key={index}
              withBorder
              padding="xl"
              radius="md"
              style={{
                backgroundColor: "#18181b",
                borderColor: "#27272a",
                color: "#f4f4f5",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
                minWidth: "200px",
              }}
            >
              <Avatar src={request.profilePicture} size={80} radius={80} mx="auto" mt={-10} />
              <Text ta="center" fz="lg" fw={500} mt="sm" style={{ color: "#f4f4f5" }}>
                {request.username}
              </Text>

              <Group mt="md" justify="center">
                <Button
                  variant="outline"
                  color="green"
                  size="sm"
                  style={{backGroundColor: "#18181b"}}
                  onClick={() => handleAcceptRequest(request.username)}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader size="sm" style={{backGroundColor: "#18181b"}} /> : "Accept"}
                </Button>
                <Button
                  variant="outline"
                  color="red"
                  size="sm"
                  onClick={() => handleRejectRequest(request.username)}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader size="sm" color="red" /> : "Reject"}
                </Button>
              </Group>

              {statusMessage && (
                <Text ta="center" fz="sm" c={statusMessage.includes("failed") ? "red" : "green"} mt="sm">
                  {statusMessage}
                </Text>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
