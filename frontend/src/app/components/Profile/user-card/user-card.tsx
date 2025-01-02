import { Avatar, Button, Card, Group, Text } from "@mantine/core";
import { Inter } from 'next/font/google';
import classes from "./UserCardImage.module.css";
import { IconUserMinus, IconUserPlus } from "@tabler/icons-react";
import { useProfile } from "@/context/profile-context";

const inter = Inter({ subsets: ['latin'], weight: ['300'] });


export function UserCardImage() {
  const { username, isCurrentUser, isFriend, pfp, rank, friendCount } = useProfile();
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
      <Text
        ta="center"
        fz="lg"
        fw={500}
        mt="sm"
        style={{ color: "#f4f4f5" }}
      >
        {username}
      </Text>
      <Group mt="md" justify="center" gap={30}>
        {items}
      </Group>
      {!(isCurrentUser === "true") && (
        <Button
          fullWidth
          radius="md"
          mt="xl"
          size="sm"
          variant="default"
          style={{
            backgroundColor: "#27272a",
            color: "#f4f4f5",
            borderColor: "#3f3f46",
          }}
          title={(isFriend === "true") ? "Remove Friend" : "Add Friend"}
        >
          {(isFriend === "true") ? (
            <IconUserMinus size={25} />
          ) : (
            <IconUserPlus size={25} />
          )}
        </Button>
      )}  
    </Card>
  );
}