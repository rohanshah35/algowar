"use client";

import { useState, useRef } from "react";
import { Button, Text, Container, Paper, Modal } from "@mantine/core";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import classes from "./create-room.module.css";
import { ChooseProblemTable } from "../choose-problem-table/choose-problem-table";

interface ProblemSummary {
  title: string;
  difficulty: string;
  acceptanceRate: number;
  slug: string;
}

export function CreateRoom() {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<ProblemSummary | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const roomCodeRef = useRef<string | null>(null);
  const router = useRouter();

  const generateRoomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const createRoom = async () => {
    if (!selectedProblem) {
      setError("Please select a problem first");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      let activeSocket = socket;
  
      if (!activeSocket) {
        activeSocket = io("http://localhost:9092");
        setSocket(activeSocket);
  
        await new Promise<void>((resolve, reject) => {
          activeSocket!.on("connect", () => {
            console.log("Socket connected");
            resolve();
          });
  
          activeSocket!.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
            reject(err);
          });
        });
  
        activeSocket.on("disconnect", () => console.log("Socket disconnected"));
      }
  
      const newRoomCode = generateRoomCode();
      setRoomCode(newRoomCode);
      roomCodeRef.current = newRoomCode;
  
      activeSocket.emit(
        "create_room",
        { roomId: newRoomCode, slug: selectedProblem.slug },
        (response: string) => {
          console.log(response);
          if (response === "error") {
            setError("Failed to create room");
          } else if (response === "success") {
            setModalOpened(true);
          }
        }
      );
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container className={classes.topContainer} size="xl" my={30}>
      <Paper
        className={classes.container}
        withBorder
        shadow="md"
        p={30}
        radius="md"
        mt="xl"
      >
        {error && <Text className={classes.errorText}>{error}</Text>}

        <ChooseProblemTable onProblemSelect={setSelectedProblem} />

        <div className={classes.controls}>
          <Button
            className={classes.control}
            fullWidth
            onClick={createRoom}
            disabled={loading}
            style={{
              marginTop: "1.5rem",
              backgroundColor: "#27272a",
              color: "#d4d4d8",
              fontWeight: 300,
            }}
          >
            {loading ? "Creating Room..." : "Create Room"}
          </Button>
        </div>
      </Paper>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Room Code"
        centered
        size="lg"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        styles={{
          content: {
            backgroundColor: "#18181b",
            color: "#f4f4f5",
            border: "1px solid #27272a",
            fontFamily: "Inter, sans-serif",
          },
          header: {
            backgroundColor: "#18181b",
            color: "#f4f4f5",
            borderBottom: "none",
            fontFamily: "Inter, sans-serif",
          },
          body: {
            fontFamily: "Inter, sans-serif",
          },
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Text size="sm" style={{ color: "#d4d4d8" }}>
            Share the room code with others so they can join!
          </Text>
          <div style={{ marginTop: "2rem" }}>
            <Text size="xl" fw={700} style={{ color: "#f4f4f5" }}>
              {roomCodeRef.current}
            </Text>
            <Button
              style={{
                marginTop: "2rem",
                backgroundColor: "#27272a",
                fontWeight: 300,
              }}
              onClick={() => {
                setModalOpened(false);
                router.push(`/game/${roomCodeRef.current}`);
              }}
            >
              Join Room
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}

export default CreateRoom;
