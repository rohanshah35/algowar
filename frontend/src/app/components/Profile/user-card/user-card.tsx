import { Avatar, Button, Card, Group, Text, Loader } from "@mantine/core";
import { Inter } from "next/font/google";
import classes from "./UserCardImage.module.css";
import { IconUserMinus, IconUserPlus } from "@tabler/icons-react";
import { useProfile } from "@/context/profile-context";
import { useState } from "react";

const inter = Inter({ subsets: ['latin'], weight: ['300'] });

const handleRemoveFriend = async (username: string) => {
  try {
    const response = await fetch(`http://localhost:8080/user/friends/${username}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  } catch (error) {
    console.error("Remove friend failed:", error);
    return null;
  }
};

const handleAddFriend = async (username: string) => {
  try {
    const response = await fetch(`http://localhost:8080/user/friends/send-friend-request/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  } catch (error) {
    console.error("Add friend failed:", error);
    return null;
  }
};

export function UserCardImage() {
  const { username, creationDate, isCurrentUser, isFriend, pfp, rank, friendCount, isFriendRequestSent } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const items = [
    { value: friendCount, label: "Friends" },
    { value: rank, label: "Rank" },
  ].map((stat) => (
    <div key={stat.label}>
      <Text ta="center" fz="lg" fw={500} style={{ color: "#f4f4f5" }}>
        {stat.value}
      </Text>
      <Text ta="center" fz="sm" c="dimmed" lh={1} style={{ color: "#a1a1aa" }}>
        {stat.label}
      </Text>
    </div>
  ));

  const handleClick = async () => {
    setIsLoading(true);
    setStatusMessage(null);

    let result;

    if (isFriend === "true") {
      result = await handleRemoveFriend(username);
    } else {
      result = await handleAddFriend(username);
    }

    setIsLoading(false);

    if (result) {
      setStatusMessage(isFriend === "true" ? "Friend removed successfully!" : "Friend added successfully!");
      window.location.reload();
    } else {
      setStatusMessage("Operation failed, please try again.");
    }
  };

  return (
    <Card
      withBorder
      padding="xl"
      radius="md"
      className={classes.card}
      style={{
        backgroundColor: "#18181b",
        borderColor: "#27272a",
        color: "#f4f4f5",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
        fontFamily: inter.style.fontFamily,
      }}
    >
      <Avatar
        src={pfp}
        size={80}
        radius={80}
        mx="auto"
        mt={-10}
        className={classes.avatar}
      />
      <Text ta="center" fz="lg" fw={500} mt="sm" style={{ color: "#f4f4f5" }}>
        {username}
      </Text>
      <Text ta="center" fz="sm" c="dimmed" lh={1} style={{ color: "#a1a1aa" }}>
        Created on {creationDate}
      </Text>
      <Group mt="md" justify="center" gap={30}>
        {items}
      </Group>
      {!(isCurrentUser === "true") && (
        <>
          <Button
            fullWidth
            radius="md"
            mt="xl"
            size="sm"
            variant="default"
            style={{
              backgroundColor: isFriendRequestSent === "true" ? "#3a3a3c" : "#27272a",
              color: isFriendRequestSent === "true" ? "#a1a1aa" : "#f4f4f5",
              borderColor: isFriendRequestSent === "true" ? "#4b4b4d" : "#3f3f46",
            }}
            title={isFriendRequestSent === "true" ? "Friend request sent" : isFriend === "true" ? "Remove Friend" : "Add Friend"}
            onClick={handleClick}
            disabled={isLoading || isFriendRequestSent === "true"}
          >
            {isLoading ? (
              <Loader size="sm" color="white" />
            ) : isFriendRequestSent === "true" ? (
              <Text ta="center" fz="sm" c="dimmed"> Friend request sent </Text>
            ) : isFriend === "true" ? (
              <IconUserMinus size={25} />
            ) : (
              <IconUserPlus size={25} />
            )}
          </Button>


          {statusMessage && (
            <Text ta="center" fz="sm" c={statusMessage.includes("failed") ? "red" : "green"} mt="sm">
              {statusMessage}
            </Text>
          )}
        </>
      )}
    </Card>
  );
}
