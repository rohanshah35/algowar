import { Avatar, Button, Paper, Text, ActionIcon } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

type SocialCardProps = {
  username: string;
  profilePicture: string;
  onRemoveFriend: (username: string) => void;
};

export function SocialCard({
  username,
  profilePicture,
  onRemoveFriend,
}: SocialCardProps) {
  return (
    <Paper
      radius="md"
      withBorder
      p="md"
      bg="#27272a"
      style={{ border: "1px solid #3f3f46", position: "relative" }}
    >
      <ActionIcon
        variant="transparent"
        onClick={() => onRemoveFriend(username)}
        size="lg"
        styles={{
          root: {
            color: "#f87171",
            border: "1px solid transparent",
            borderRadius: "50%",
            transition: "background-color 0.2s ease",
            position: "absolute",
            top: "10px",
            right: "10px",
            "&:hover": {
              backgroundColor: "#3f3f46",
            },
          }
        }}
        title="Remove Friend"
      >
        <IconX size={24} />
      </ActionIcon>

      <Avatar
        src={profilePicture}
        alt={`https://algowar.s3.us-west-1.amazonaws.com/profile-pictures/default.jpg`}
        size={120}
        radius={100}
        mx="auto"
      />
      
      <Text ta="center" fz="lg" fw={500} mt="sm" c="#d4d4d8">
        {username}
      </Text>

      <Button
        variant="default"
        fullWidth
        mt="sm"
        styles={{
          root: {
            backgroundColor: "#27272a",
            borderColor: "#3f3f46",
            color: "#d4d4d8",
            "&:hover": {
              backgroundColor: "#3f3f46",
            },
          },
        }}
      >
        Invite +
      </Button>
    </Paper>
  );
}