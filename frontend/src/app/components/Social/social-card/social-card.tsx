import { Avatar, Button, Paper, Text, ActionIcon, Modal } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['300'] });

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
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <>
      <Paper
        radius="md"
        withBorder
        p="md"
        bg="#27272a"
        style={{ border: "1px solid #3f3f46", position: "relative", boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.5)" }}
      >
        <ActionIcon
          variant="transparent"
          onClick={() => setModalOpened(true)}
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
      
      <Text ta="center" fz="md" fw={500} mt="sm" c="#d4d4d8" style={{ fontFamily: inter.style.fontFamily }}>
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
              fontFamily: inter.style.fontFamily,
              fontSize: "0.75rem",
            },
          }}
        >
          Invite +
        </Button>
      </Paper>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Remove friend?"
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
            Are you sure you want to remove {username} from your friends list?
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
                Cancel
            </Button>
            <Button
                style={{ 
                    backgroundColor: "#c04f4f",
                    fontWeight: 300
                 }}
                onClick={() => {
                    onRemoveFriend(username);
                    setModalOpened(false);
                }}
            >
                Remove friend
            </Button>
        </div>
      </Modal>
    </>
  );
}