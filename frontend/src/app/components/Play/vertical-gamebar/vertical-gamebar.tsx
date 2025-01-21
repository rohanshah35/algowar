import React, { useState, useEffect, useRef } from 'react';
import { IconSend } from '@tabler/icons-react';
import { Progress } from '@mantine/core';
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
}

export function VerticalGamebar({ timer, currentPlayer, opponent, socket }: VerticalGamebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
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
      socket.emit('message2', {
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

  return (
    <nav className={classes.navbar}>
      <div className={classes.timeSection}>
        <div className={classes.time}>{formatTime(timer)}</div>
        <div className={classes.subheader}>PTX3RY</div>
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
          <button className={`${classes.actionButton} ${classes.drawButton}`}>
            DRAW
          </button>
          <button className={`${classes.actionButton} ${classes.forfeitButton}`}>
            FORFEIT
          </button>
        </div>
      </div>
    </nav>
  );
}