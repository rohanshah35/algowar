import { useState, useEffect } from 'react';
import { Avatar, Button, Text, Stack, Progress } from '@mantine/core';
import classes from './game-status.module.css';

interface GameStatusProps {
  gameId: string;
  opponent: {
    username: string;
    elo: number;
    avatar?: string;
  };
  testCasesPassed: number;
  totalTestCases: number;
  linesOfCode: number;
  onDraw: () => void;
  onForfeit: () => void;
}

export function GameStatus({
  gameId,
  opponent,
  testCasesPassed,
  totalTestCases,
  linesOfCode,
  onDraw,
  onForfeit,
}: GameStatusProps) {
  const [timeLeft, setTimeLeft] = useState('6:32');

  // Timer logic (simplified)
  useEffect(() => {
    // Add your timer logic here
  }, []);

  return (
    <div className={classes.gameStatus}>
      <Stack spacing="xs" align="center">
        {/* Timer */}
        <Text size="xl" fw={700} className={classes.timer}>
          {timeLeft}
        </Text>
        
        {/* Game ID */}
        <Text size="sm" c="dimmed">
          {gameId}
        </Text>

        {/* Opponent Section */}
        <Text size="sm" fw={500} className={classes.sectionLabel}>
          OPPONENT
        </Text>
        <Avatar 
          size={80} 
          radius="xl" 
          src={opponent.avatar}
          className={classes.avatar}
        />
        <Text size="sm">{opponent.username}</Text>
        <Text size="sm" c="dimmed">{opponent.elo}</Text>

        {/* Stats */}
        <div className={classes.statsContainer}>
          <Text size="sm">Test cases passed</Text>
          <Text size="sm">
            {testCasesPassed}/{totalTestCases}
          </Text>
          
          <Text size="sm" mt="md">Lines of code</Text>
          <Text size="sm">{linesOfCode}</Text>
        </div>

        {/* Action Buttons */}
        <div className={classes.buttonContainer}>
          <Button 
            variant="outline" 
            onClick={onDraw}
            className={classes.actionButton}
          >
            DRAW
          </Button>
          <Button 
            variant="outline" 
            color="red" 
            onClick={onForfeit}
            className={classes.actionButton}
          >
            FORFEIT
          </Button>
        </div>
      </Stack>
    </div>
  );
}