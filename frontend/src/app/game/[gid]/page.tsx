"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import Workspace from "@/components/Practice/workspace";
import { VerticalGamebar } from "@/components/Play/vertical-gamebar/vertical-gamebar";
import classes from "./game.module.css";
import { useAuthStore } from "@/store/auth-store";

interface PlayerData {
  username: string;
  pfp: string;
  elo: string;
}

export default function ProblemPageWrapper() {
  const router = useRouter();
  const { gid } = useParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [problemSlug, setProblemSlug] = useState<string | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [players, setPlayers] = useState<PlayerData[]>([]);

  const { username, checkAuth } = useAuthStore();

  useEffect(() => {
    // Ensure the user is authenticated
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!gid) {
      setError("Invalid game ID. Redirecting...");
      setTimeout(() => router.push("/"), 3000);
      return;
    }

    if (!username) return;

    const socketConnection = io("http://localhost:9092");

    socketConnection.emit(
      "join_room",
      { roomId: gid, username },
      (response: { status: string; slug: string }) => {
        if (response.status === "error") {
          setError("Failed to join room. It might be full or doesn't exist.");
        } else if (response.status === "success" && response.slug) {
          setProblemSlug(response.slug);
        } else {
          setError("Unexpected response from the server.");
        }
      }
    );

    socketConnection.on("room_update", (playersData: PlayerData[]) => {
      setPlayers(playersData);
    });

    socketConnection.on("timer_update", (remainingTime: number) => {
      setTimer(remainingTime);
    });

    socketConnection.on("timer_ended", () => {
      setTimer(0);
    });

    setSocket(socketConnection);

    // Cleanup socket on unmount
    return () => {
      socketConnection.disconnect();
    };
  }, [gid, router, username]);

  useEffect(() => {
    if (error) {
      console.error("Error:", error);
    }
  }, [error]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!problemSlug) {
    return <div>Loading...</div>;
  }

  const sortedPlayers = players.sort((a, b) =>
    a.username === username ? -1 : b.username === username ? 1 : 0
  );

  return (
    <div className={classes.pageContainer}>
      <VerticalGamebar
        timer={timer}
        currentPlayer={sortedPlayers[0]}
        opponent={sortedPlayers[1]}
        socket={socket}
        gid={gid}
        />
      <main className={classes.mainContent}>
        <Workspace slug={problemSlug} />
      </main>
    </div>
  );
}
