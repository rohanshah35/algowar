"use client";
import { useState, useEffect } from "react";
import { Button, Modal, Text, Container, Paper } from "@mantine/core";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import classes from "./create-room.module.css";

export function CreateRoom() {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {

    const socketConnection = io("http://localhost:9092");
    setSocket(socketConnection);

    return () => {
      if (socketConnection) {
        socketConnection.disconnect();
      }
    };
  }, []);

  const generateRoomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  
  const createRoom = async () => {
      setLoading(true);
      setError(null);
      try {
          const newRoomCode = generateRoomCode();
          setRoomCode(newRoomCode);
  
          socket.emit("create_room", newRoomCode, (response: string) => {
              if (response == "error") {
                  setError("death");
              } else if (response == "success") {
                  setModalOpened(true);
              }
          });
      } catch (err: any) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };
  
  useEffect(() => {
    if (socket) {
      socket.on("room_full", (message: string) => {
        setError(message);
      });

      socket.on("joined_room", (message: string) => {
        console.log(message);
      });

      socket.on("user_joined", (message: string) => {
        console.log(message);
      });

      socket.on("room_message", (message: string) => {
        console.log(message);
      });
    }
  }, [socket]);

  return (
    <Container className={classes.topContainer} size={460} my={30}>
      <Paper className={classes.container} withBorder shadow="md" p={30} radius="md" mt="xl">
        {error && <Text className={classes.errorText}>{error}</Text>}

        <div className={classes.controls}>
          <Button className={classes.control} fullWidth onClick={createRoom} disabled={loading} color="#27272a">
            {loading ? "Creating Room..." : "Create Room"}
          </Button>
        </div>
      </Paper>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Room Code"
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
          },
        }}
      >
        <Text size="sm" style={{ color: "#d4d4d8" }}>
          Share the room code with others so they can join!
        </Text>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <Text size="xl" fw={700} style={{ color: "#f4f4f5" }}>
            {roomCode}
          </Text>
          <Button
            style={{
              marginTop: "2rem",
              backgroundColor: "#27272a",
              fontWeight: 300,
            }}
            onClick={() => router.push(`/game/${roomCode}`)}
          >
            Join Room
          </Button>
        </div>
      </Modal>
    </Container>
  );
}

export default CreateRoom;
