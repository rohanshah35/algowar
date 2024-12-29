'use client';

import { Table, TableData } from '@mantine/core';
import { useEffect, useState } from 'react';

export function LeaderboardTable() {
  const [tableData, setTableData] = useState<TableData>({
    head: ['RANK', 'USERNAME', 'WINS', 'ELO'],
    body: [],
  });

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch('http://localhost:8080/user/leaderboard', {
          credentials: 'include',
        });

        if (!response.ok) {
          console.error(`API error: ${response.statusText}`);
          return;
        }

        const data = await response.json();

        const body = data
          .sort((a: { elo: number }, b: { elo: number }) => b.elo - a.elo)
          .map((player: { preferredUsername: string; wins: number; elo: number }, index: number) => [
            index + 1,
            player.preferredUsername,
            player.wins,
            player.elo,
          ]);

        setTableData((prev) => ({ ...prev, body }));
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <Table
      data={tableData}
      styles={{
        table: {
          color: '#d4d4d8',
        },
        thead: {
          backgroundColor: '#3f3f46',
        },
        th: {
          color: '#d4d4d8 !important',
          fontSize: '0.9rem',
          fontWeight: 600,
          padding: '1rem',
        },
        td: {
          color: '#d4d4d8',
          padding: '0.75rem 1rem',
          fontSize: '0.95rem',
        },
      }}
    />
  );
}
