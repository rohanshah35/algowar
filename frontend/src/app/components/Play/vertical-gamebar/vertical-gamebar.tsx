import React, { useState, useEffect, useRef } from 'react';
import { IconSend } from '@tabler/icons-react';
import { Button, Modal, Progress } from '@mantine/core';
import { useRouter } from 'next/navigation';
import classes from './vertical-gamebar.module.css';
import { Socket } from 'socket.io-client';

interface PlayerData {
  username: string;
  pfp: string;
  elo: string;
}

interface ChatMessage {
  username: string;
  content: string;
}

interface VerticalGamebarProps {
  timer: number | null;
  currentPlayer?: PlayerData;
  opponent?: PlayerData;
  socket?: Socket | null;
  gid: string | string[] | undefined;
}

export function VerticalGamebar({ timer, currentPlayer, opponent, socket, gid }: VerticalGamebarProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [drawModalOpen, setDrawModalOpen] = useState(false);
  const [forfeitModalOpen, setForfeitModalOpen] = useState(false);
  const [drawRequestModalOpen, setDrawRequestModalOpen] = useState(false);
  const [gameEndModalOpen, setGameEndModalOpen] = useState(false);
  const [gameEndReason, setGameEndReason] = useState('');
  const [gameEndCountdown, setGameEndCountdown] = useState(5);
  const [drawRequesterUsername, setDrawRequesterUsername] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('room_message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('draw_requested', (requesterUsername: string) => {
      if (requesterUsername !== currentPlayer?.username) {
        setDrawRequesterUsername(requesterUsername);
        setDrawRequestModalOpen(true);
      }
    });

    socket.on('draw_rejected', () => {
      alert('Draw request was declined');
    });

    socket.on('game_draw', () => {
      setGameEndReason('draw');
      setWinner(null);
      setGameEndModalOpen(true);
    });

    socket.on('game_forfeit', (username: string) => {
      setGameEndReason('forfeit');
      setWinner(username || null);
      setGameEndModalOpen(true);
    });

    return () => {
      socket.off('room_message');
      socket.off('draw_requested');
      socket.off('draw_rejected');
      socket.off('game_draw');
      socket.off('game_forfeit');
    };
  }, [socket, currentPlayer, opponent]);

  // Handle countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameEndModalOpen && gameEndCountdown > 0) {
      timer = setInterval(() => {
        setGameEndCountdown(prev => {
          if (prev <= 1) {
            setShouldRedirect(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [gameEndModalOpen]);

  // Handle navigation separately
  useEffect(() => {
    if (shouldRedirect) {
      router.push('/');
    }
  }, [shouldRedirect, router]);

  // Reset states when component unmounts
  useEffect(() => {
    return () => {
      setGameEndModalOpen(false);
      setGameEndCountdown(5);
      setShouldRedirect(false);
    };
  }, []);


  const handleSendMessage = () => {
    if (newMessage.trim().length > 0 && socket && currentPlayer) {
      socket.emit('chat_message', {
        username: currentPlayer.username,
        content: newMessage.trim()
      });
      setNewMessage('');
    }
  };

  const handleDrawRequest = () => {
    console.log('Requesting draw');
    socket?.emit('request_draw', gid);
    setDrawModalOpen(false);
  };

  const handleDrawResponse = (accepted: boolean) => {
    socket?.emit('respond_draw', {
      roomId: gid,
      accepted
    });
    setDrawRequestModalOpen(false);
  };

  const handleForfeit = () => {
    socket?.emit('forfeit', {
      roomId: gid,
      opponent: opponent?.username
    });
    setForfeitModalOpen(false);
  };

  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return 'Waiting';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.timeSection}>
        <div className={classes.time}>{formatTime(timer)}</div>
        <div className={classes.subheader}>{gid}</div>
      </div>

      <div className={classes.playersSection}>
        {currentPlayer && (
          <div className={classes.playerCard}>
            <img 
              src={currentPlayer.pfp} 
              alt={`${currentPlayer.username}'s avatar`}
              className={classes.avatar} 
            />
            <div className={`${classes.playerName} ${classes.playerOne}`}>
              {currentPlayer.username}
            </div>
            <div className={classes.playerRating}>{currentPlayer.elo}</div>

            <div className={classes.statsSection}>
              <div className={classes.statBox}>
                <div className={classes.statLabel}>TEST CASES PASSED</div>
                <div className={classes.statValue}>16/20</div>
                <Progress value={(16 / 20) * 100} size="xs" color="#4caf50" mt="xs" />
              </div>

              <div className={classes.statBox}>
                <div className={classes.statLabel}>LINES OF CODE</div>
                <div className={`${classes.statValue} ${classes.linesOfCode}`}>
                  30<span className={classes.ellipses} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={classes.vsLabel}>VS</div>

        {opponent && (
          <div className={classes.playerCard}>
            <img 
              src={opponent.pfp} 
              alt={`${opponent.username}'s avatar`}
              className={classes.avatar} 
            />
            <div className={`${classes.playerName} ${classes.playerTwo}`}>
              {opponent.username}
            </div>
            <div className={classes.playerRating}>{opponent.elo}</div>

            <div className={classes.statsSection}>
              <div className={classes.statBox}>
                <div className={classes.statLabel}>TEST CASES PASSED</div>
                <div className={classes.statValue}>9/20</div>
                <Progress value={(9 / 20) * 100} size="xs" color="#ff4d4d" mt="xs" />
              </div>

              <div className={classes.statBox}>
                <div className={classes.statLabel}>LINES OF CODE</div>
                <div className={`${classes.statValue} ${classes.linesOfCode}`}>
                  39<span className={classes.ellipses} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={classes.bottomSection}>
        <div className={classes.chatWindow}>
          <div className={classes.chatMessages}>
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`${classes.messageBubble} ${
                  msg.username === currentPlayer?.username ? classes.currentUser : ''
                }`}
              >
                <span className={classes.messageUsername}>{msg.username}: </span>
                <span className={classes.messageContent}>{msg.content}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className={classes.chatInputContainer}>
            <input
              className={classes.chatInput}
              placeholder="Say something..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
            />
            {/* <button className={classes.sendButton} onClick={handleSendMessage}>
              <IconSend stroke={0.5} />
            </button> */}
          </div>
        </div>

        <div className={classes.actionButtons}>
          <button
            className={`${classes.actionButton} ${classes.drawButton}`}
            onClick={() => setDrawModalOpen(true)}
          >
            DRAW
          </button>
          <button
            className={`${classes.actionButton} ${classes.forfeitButton}`}
            onClick={() => setForfeitModalOpen(true)}
            >
            FORFEIT
          </button>
        </div>

        <Modal
        opened={gameEndModalOpen}
        onClose={() => {}} // Prevent manual closing
        title={`Game Over - ${gameEndReason.charAt(0).toUpperCase() + gameEndReason.slice(1)}`}
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
            color: "#f4f4f5",
            fontSize: "1.5rem",
            fontWeight: "600",
            borderBottom: "none",
            fontFamily: "Inter, sans-serif",
          },
          body: {
            fontFamily: 'Inter, sans-serif',
          }
        }}
      >
        <div className="text-center">
          {winner ? (
            <p className="text-xl mb-4">{winner} wins by forfeit!</p>
          ) : (
            <p className="text-xl mb-4">The game ended in a draw</p>
          )}
          <p className="text-lg">Redirecting to home in {gameEndCountdown} seconds...</p>
        </div>
      </Modal>

      <Modal
        opened={drawModalOpen}
        onClose={() => setDrawModalOpen(false)}
        title="Are you sure you want to request a draw?"
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
            color: "#f4f4f5",
            borderBottom: "none",
            fontFamily: 'Inter, sans-serif',
          },
          body: {
            fontFamily: 'Inter, sans-serif',
          }
        }}
      >
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "1rem", 
          marginTop: "1rem" 
        }}>
          <Button
            variant="outline"
            style={{ 
              borderColor: "#27272a",
              color: "#f4f4f5",
              backgroundColor: "#27272a",
              fontWeight: 300
            }}
            onClick={handleDrawRequest}
          >
            Yes
          </Button>
          <Button
            style={{ 
              backgroundColor: "transparent",
              fontWeight: 600
            }}
            onClick={() => setDrawModalOpen(false)}
          >
            No
          </Button>
        </div>
      </Modal>

      <Modal
        opened={drawRequestModalOpen}
        onClose={() => setDrawRequestModalOpen(false)}
        title="Draw Request"
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
          }
        }}
      >
        <p className="text-center mb-4">{drawRequesterUsername} has requested a draw</p>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "1rem", 
          marginTop: "1rem" 
        }}>
          <Button
            variant="outline"
            style={{ 
              borderColor: "#27272a",
              color: "#f4f4f5",
              backgroundColor: "#c04f4f",
              fontWeight: 300
            }}
            onClick={() => handleDrawResponse(true)}
          >
            Accept
          </Button>
          <Button
            style={{ 
              backgroundColor: "transparent",
              fontWeight: 600
            }}
            onClick={() => handleDrawResponse(false)}
          >
            Decline
          </Button>
        </div>
      </Modal>

      <Modal
        opened={forfeitModalOpen}
        onClose={() => setForfeitModalOpen(false)}
        title="Are you sure you want to forfeit the game?"
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
            fontFamily: 'Inter, sans-serif',
          }
        }}
      >
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "1rem", 
          marginTop: "1rem" 
        }}>
          <Button
            variant="outline"
            style={{ 
              borderColor: "#27272a",
              color: "#f4f4f5",
              backgroundColor: "#c04f4f",
              fontWeight: 300
            }}
            onClick={handleForfeit}
          >
            Forfeit
          </Button>
          <Button
            style={{ 
              backgroundColor: "transparent",
              fontWeight: 300
            }}
            onClick={() => setForfeitModalOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>

      </div>
    </nav>
  );
}