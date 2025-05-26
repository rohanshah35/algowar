"use client";

import { Container, Paper, Text, TextInput, Button } from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/navigation";
import classes from "./join-room.module.css";

export function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleJoinRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    setError(null);

    if (!roomCode) {
      setError("Please enter a room code.");
      return;
    }

    setLoading(true);

    router.push(`/game/${roomCode}`);
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
        <form onSubmit={handleJoinRoom}>
          <TextInput
            name="roomCode"
            required
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            classNames={{ input: classes.textInput }}
          />

          {error && <Text className={classes.errorText}>{error}</Text>}

          <div className={classes.controls}>
            <Button
              type="submit"
              className={classes.control}
              disabled={loading}
            >
              {loading ? "Joining Room..." : "Join Room"}
            </Button>
          </div>
        </form>
      </Paper>
    </Container>
  );
}

export default JoinRoom;
