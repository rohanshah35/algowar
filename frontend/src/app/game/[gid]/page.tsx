"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import Workspace from "@/components/Practice/workspace";

export default function ProblemPageWrapper() {
  const router = useRouter();
  const { gid } = useParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [problemSlug, setProblemSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!gid) {
      setError("Invalid game ID. Redirecting...");
      setTimeout(() => router.push("/"), 3000);
      return;
    }

    const socketConnection = io("http://localhost:9092");

    socketConnection.emit(
      "join_room",
      gid,
      (response: { status: string; slug: string }) => {
        if (response.status === "error") {
          console.log(response.status);
          setError("Failed to join room. It might be full or doesn't exist.");
        } else if (response.status === "success" && response.slug) {
          setProblemSlug(response.slug);
        } else {
          setError("Unexpected response from the server.");
        }
      }
    );
    

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, [gid, router]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!problemSlug) {
    return <div>Loading...</div>;
  }

  return <Workspace slug={problemSlug} />;
}
