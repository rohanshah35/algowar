import { Avatar, Button, Paper, Text } from "@mantine/core";

type SocialCardProps = {
  username: string;
};

export function SocialCard({ username }: SocialCardProps) {
  return (
    <Paper
      radius="md"
      withBorder
      p="md"
      bg="#27272a"
      style={{ border: "1px solid #3f3f46" }}
    >
      <Avatar
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
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
        Send message
      </Button>
    </Paper>
  );
}
