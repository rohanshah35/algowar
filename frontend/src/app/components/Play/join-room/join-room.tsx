"use client";

import { Container, Paper, Text, TextInput, Button } from "@mantine/core";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import classes from "./join-room.module.css";
import { useRouter } from "next/navigation";

export function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<any>(null);
    const router = useRouter();

  useEffect(() => {
    // Initialize a new Socket.IO connection when the component mounts
    const socketConnection = io("http://localhost:9092");
    setSocket(socketConnection);

    // Clean up the connection when the component unmounts
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const handleJoinRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setError(null);

    if (!roomCode) {
      setError("Please enter a room code.");
      return;
    }

    setLoading(true);

    // Emit the join_room event to the server with the roomCode
    socket.emit("join_room", roomCode, (response: string) => {
      if (response === "error") {
        setError("Failed to join room. It might be full or doesn't exist.");
      } else if (response === "success") {
        // Handle success (e.g., navigate to the room's page or show a success message)
        console.log(`Successfully joined room: ${roomCode}`);
      }
      setLoading(false);
    });
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
              onClick={() => router.push(`/game/${roomCode}`)}
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
