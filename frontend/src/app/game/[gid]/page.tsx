"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import Workspace from "@/components/Practice/workspace";
import { VerticalGamebar } from "@/components/Play/vertical-gamebar/vertical-gamebar";
import classes from "./game.module.css";

// Import the Zustand store
import { useAuthStore } from "@/store/auth-store";

export default function ProblemPageWrapper() {
  const router = useRouter();
  const { gid } = useParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [problemSlug, setProblemSlug] = useState<string | null>(null);
  const [timer, setTimer] = useState<number | null>(null);

  // Get the username and the checkAuth function from the Zustand store
  const { username, checkAuth } = useAuthStore();

  // On component mount, check auth to populate the username
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // If no game ID, redirect
    if (!gid) {
      setError("Invalid game ID. Redirecting...");
      setTimeout(() => router.push("/"), 3000);
      return;
    }

    // Wait for username to be retrieved before connecting the socket
    if (!username) return;

    const socketConnection = io("http://localhost:9092");

    // Join the room after obtaining username from the store
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

    // Listen for timer updates
    socketConnection.on("timer_update", (remainingTime: number) => {
      setTimer(remainingTime);
    });

    // Listen for timer end
    socketConnection.on("timer_ended", () => {
      setTimer(0); // Timer has ended
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, [gid, router, username]);

  if (error) {
    return <div>{error}</div>;
  }

  // If the server hasn't responded yet with the slug (and no error), show loading
  if (!problemSlug) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.pageContainer}>
      <VerticalGamebar timer={timer} />
      <main className={classes.mainContent}>
        <Workspace slug={problemSlug} />
      </main>
    </div>
  );
}
