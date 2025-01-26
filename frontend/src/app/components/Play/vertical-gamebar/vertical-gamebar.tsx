import React, { useState, useEffect, useRef } from 'react';
import { IconSend } from '@tabler/icons-react';
import { Button, Modal, Progress } from '@mantine/core';
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [drawModalOpen, setDrawModalOpen] = useState(false);
  const [forfeitModalOpen, setForfeitModalOpen] = useState(false);
  const [drawRequestModalOpen, setDrawRequestModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('room_message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('room_message');
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (newMessage.trim().length > 0 && socket && currentPlayer) {
      socket.emit('chat_message', {
        username: currentPlayer.username,
        content: newMessage.trim()
      });
      setNewMessage('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return 'Waiting';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleForfeit = (gid: string | string[] | undefined): any => {


    socket?.emit('forfeit', gid, (response: any) => {
      // Optional: Handle server acknowledgment
      console.log('Forfeit response:', response);
      
      // Potential additional UI actions like:
      // - Show forfeit confirmation
      // - Redirect to game end screen
      // - Update game state
    });
  }

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
            <button className={classes.sendButton} onClick={handleSendMessage}>
              <IconSend stroke={0.5} />
            </button>
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
        opened={drawModalOpen}
        onClose={() => setDrawModalOpen(false)}
        title="Are you sure you want to request a draw"
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
          >
              Yes
          </Button>
          <Button
              style={{ 
                  backgroundColor: "transparent",
                  fontWeight: 300
              }}
              onClick={() => setForfeitModalOpen(false)}
          >
              Decline
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
          >
              Accept
          </Button>
          <Button
              style={{ 
                  backgroundColor: "transparent",
                  fontWeight: 300
              }}
              onClick={() => setForfeitModalOpen(false)}
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
              onClick={() => handleForfeit(gid)}
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