"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import CompetitiveWorkspace from "@/components/Play/competitive-workspace/competitive-workspace";
import { VerticalGamebar } from "@/components/Play/vertical-gamebar/vertical-gamebar";
import { Modal, Button } from "@mantine/core";
import classes from "./game.module.css";
import { useAuthStore } from "@/store/auth-store";

interface PlayerData {
  username: string;
  pfp: string;
  elo: string;
}

interface LiveCodeLineCount {
  currentPlayer: number;
  opponent: number;
}

interface LiveTestCasesCount {
  currentPlayerAccepted: number;
  currentPlayerTotal: number;
  opponentAccepted: number;
  opponentTotal: number;
}

export default function ProblemPageWrapper() {
  const router = useRouter();
  const { gid } = useParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [problemSlug, setProblemSlug] = useState<string | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [strikes, setStrikes] = useState<number>(3); // Track strikes
  const [modalOpened, setModalOpened] = useState<boolean>(false); // Control modal visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [liveCodeLineCount, setLiveCodeLineCount] = useState<LiveCodeLineCount>({ currentPlayer: 0, opponent: 0 });
  const [liveTestCasesCount, setLiveTestCasesCount] = useState<LiveTestCasesCount>({ currentPlayerAccepted: 0, currentPlayerTotal: 0, opponentAccepted: 0, opponentTotal: 0 });

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

    socketConnection.on("draw_requested", (requesterUsername: string) => {
      console.log(`Draw has been requested by ${requesterUsername}`);
    });

    socketConnection.on("game_forfeit", () => {
      console.log("Game has been forfeited");
    });

    socketConnection.on("live_code_line_count", (response: {lineCount: number, username: string}) => {
      if (response.username === username) return;
      setLiveCodeLineCount((prev) => ({
        ...prev,
        opponent: response.lineCount,
      }));
    });

    socketConnection.on("live_test_cases_count", (response: {accepted: number, total: number, username: string}) => {
      if (response.username === username) return;
      setLiveTestCasesCount((prev) => ({
        ...prev,
        opponentAccepted: response.accepted,
        opponentTotal: response.total,
      }));
    });

    setSocket(socketConnection);

    // Cleanup socket on unmount
    return () => {
      socketConnection.disconnect();
    };
  }, [gid, router, username]);

  // Function to emit live code line count updates
  const updateLiveCodeLineCount = (currentPlayer: number) => {
    setLiveCodeLineCount((prev) => ({
      ...prev,
      currentPlayer,
    }));

    if (socket) {
      socket.emit("live_code_line_count", {
        lineCount: currentPlayer,
        username,
      });
    }
  };

  const updateLiveTestCasesCount = (currentPlayerAccepted: number, currentPlayerTotal: number) => {
    if (!currentPlayerTotal) return;
    if (!currentPlayerAccepted) return;
    setLiveTestCasesCount((prev) => ({
      ...prev,
      currentPlayerAccepted,
      currentPlayerTotal,
    }));

    if (socket) {
      socket.emit("live_test_cases_count", {
        accepted: currentPlayerAccepted,
        total: currentPlayerTotal,
        username,
      });
    }
  }

  // Track tab visibility and strikes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden, decrement strikes and show modal
        // setStrikes((prevStrikes) => {
        //   const newStrikes = prevStrikes - 1;

        //   if (newStrikes <= 0) {
        //     // Emit auto-forfeit event if strikes reach 0
        //     // socket?.emit("auto_forfeit", { roomId: gid, username });
        //     console.log("Auto-forfeit triggered");
        //   } else {
        //     // Show modal if strikes are greater than 0
        //     setModalOpened(true);
        //   }

        //   return newStrikes;
        // });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [socket, gid, username]);

  // Handle modal close edge case
  const handleModalClose = () => {
    if (strikes <= 0) {
      // Emit auto-forfeit immediately if strikes are 0 or below
      // socket?.emit("auto_forfeit", { roomId: gid, username });
      console.log("Auto-forfeit triggered on modal close");
    } else {
      // Close the modal if strikes are still available
      setModalOpened(false);
    }
  };

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
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        liveCodeLineCount={liveCodeLineCount}
        liveTestCasesCount={liveTestCasesCount}
      />
      <main className={classes.mainContent}
        style={{ marginLeft: isSidebarOpen ? "250px" : "0" }}
      >
        <CompetitiveWorkspace
          slug={problemSlug}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={() => setIsSidebarOpen(!isSidebarOpen)}
          updateLiveCodeLineCount={updateLiveCodeLineCount}
          updateLiveTestCasesCount={updateLiveTestCasesCount}
        />
      </main>

      <Modal
        opened={modalOpened}
        onClose={handleModalClose}
        title="Tab Leave Detected"
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
            fontFamily: "Inter, sans-serif",
            borderRadius: "16px",
            padding: "20px",
          },
          header: {
            backgroundColor: "#18181b",
            color: "#ff6b6b",
            fontSize: "1.5rem",
            fontWeight: "600",
            borderBottom: "none",
            fontFamily: "Inter, sans-serif",
          },
          body: {
            fontFamily: "Inter, sans-serif",
            fontSize: "1rem",
            lineHeight: "1.5",
          },
        }}
      >
        {strikes > 0 ? (
          <>
            <p>You are not allowed to leave the tab in competitive mode!</p>
            <p>
              You have <b>{strikes}</b> more {strikes === 1 ? "strike" : "strikes"} before an auto-forfeit is enacted.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "16px",
              }}
            >
              <Button
                style={{
                  backgroundColor: "#ff6b6b",
                  color: "#f4f4f5",
                  border: "none",
                  fontWeight: 500,
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontFamily: "Inter, sans-serif",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onClick={handleModalClose}
              >
                OK
              </Button>
            </div>
          </>
        ) : (
          <>
            <p>You have no strikes remaining!</p>
            <p>An auto-forfeit has been triggered.</p>
          </>
        )}
      </Modal>
    </div>
  );
}
