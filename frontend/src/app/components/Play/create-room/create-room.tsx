"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Text, Container, Paper } from "@mantine/core";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { modals } from "@mantine/modals";
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
  const [socket, setSocket] = useState<any>(null);
  const roomCodeRef = useRef<string | null>(null);
  const router = useRouter();

  useEffect(() => {
      const socketConnection = io("http://localhost:9092");
      setSocket(socketConnection);

      socketConnection.on("connect", () => console.log("Socket connected"));
      socketConnection.on("disconnect", () => console.log("Socket disconnected"));

      return () => {
        socketConnection.disconnect();
        setSocket(null);
      };
  }, []);

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
      const newRoomCode = generateRoomCode();
      setRoomCode(newRoomCode);
      roomCodeRef.current = newRoomCode;

      socket.emit("create_room", { roomId: newRoomCode, slug: selectedProblem.slug }, (response: string) => {
        console.log(response);
        if (response === "error") {
          setError("Failed to create room");
        } else if (response === "success") {
          modals.closeAll();
          openSecondModal();
        }
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleProblemSelect = (problem: ProblemSummary) => {
    setSelectedProblem(problem);
  }

  const openFirstModal = () => {
    modals.open({
      title: "Choose Problem",
      size: "xl",
      centered: true,
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      styles: {
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
      },
      children: (
        <>
          <ChooseProblemTable
            onProblemSelect={handleProblemSelect}
          />
          <Button
            fullWidth
            mt="md"
            onClick={createRoom}
            style={{
              marginTop: "2rem",
              backgroundColor: "#27272a",
              fontWeight: 300,
            }}
          > 
          Create Room
          </Button>
        </>
      ),
    });
  };

  const openSecondModal = () => {
    modals.open({
      title: "",
      centered: true,
      size: "lg",
      overlayProps: {
        backgroundOpacity: 0.55,
        blur: 3,
      },
      styles: {
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
      },
      children: (
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
                modals.closeAll();
                router.push(`/game/${roomCodeRef.current}`);
              }}
            >
              Join Room
            </Button>
          </div>
        </div>
      ),
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
        {error && <Text className={classes.errorText}>{error}</Text>}

        <div className={classes.controls}>
          <Button
            className={classes.control}
            fullWidth
            onClick={openFirstModal}
            disabled={loading}
            color="#27272a"
          >
            {loading ? "Loading..." : "Create Room +"}
          </Button>
        </div>
      </Paper>
    </Container>
  );
}

export default CreateRoom;
