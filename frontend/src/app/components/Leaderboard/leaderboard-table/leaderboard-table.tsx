'use client';

import { Table, Card } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['300'] });

export function LeaderboardTable() {
  const [tableData, setTableData] = useState<any>({
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

        setTableData((prev: any) => ({ ...prev, body }));
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (!tableData) {
    return <div></div>
  }

  return (
    <Card
      withBorder
      radius="md"
      style={{
        backgroundColor: '#18181b',
        borderColor: 'transparent',
        color: '#f4f4f5',
        padding: '2rem',
        height: '100%',
        minHeight: '450px',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: inter.style.fontFamily,
      }}
    >
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Table
          striped
          highlightOnHover
          verticalSpacing="lg"
          horizontalSpacing="lg"
          style={{
            borderCollapse: 'collapse',
            width: '100%',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'center',
                  color: '#f4f4f5',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #27272a',
                  fontSize: '1rem',
                }}
              >
                Rank
              </th>
              <th
                style={{
                  textAlign: 'center',
                  color: '#f4f4f5',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #27272a',
                  fontSize: '1rem',
                }}
              >
                Username
              </th>
              <th
                style={{
                  textAlign: 'center',
                  color: '#f4f4f5',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #27272a',
                  fontSize: '1rem',
                }}
              >
                Wins
              </th>
              <th
                style={{
                  textAlign: 'center',
                  color: '#f4f4f5',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #27272a',
                  fontSize: '1rem',
                }}
              >
                ELO
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.body.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '1.5rem', color: '#a0a0a0', fontSize: '1.5rem' }}>
                </td>
              </tr>
            ) : (
              tableData.body.map((row: any, index: number) => (
                <tr key={index} style={{ borderBottom: '1px solid #27272a' }}>
                  <td
                    style={{
                      textAlign: 'center',
                      padding: '1rem',
                      fontSize: '1rem',
                    }}
                  >
                    {row[0]}
                  </td>
                  <td
                    style={{
                      textAlign: 'center',
                      padding: '1rem',
                      fontSize: '1rem',
                    }}
                  >
                    {row[1]}
                  </td>
                  <td
                    style={{
                      textAlign: 'center',
                      padding: '1rem',
                      fontSize: '1rem',
                    }}
                  >
                    {row[2]}
                  </td>
                  <td
                    style={{
                      textAlign: 'center',
                      padding: '1rem',
                      fontSize: '1rem',
                    }}
                  >
                    {row[3]}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </Card>
  );
}
