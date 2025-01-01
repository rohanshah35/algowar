import React from 'react';
import { Table, Card } from '@mantine/core';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['300'] });

export function MatchHistory(): React.ReactElement {
  const matchHistory = [
    { problem: 'Two Sum', date: '2023-01-15', opponent: 'Player123', result: 'Win', eloChange: '+30' },
    { problem: 'Reverse Linked List', date: '2023-01-18', opponent: 'Player456', result: 'Loss', eloChange: '-20' },
    { problem: 'Binary Search', date: '2023-01-20', opponent: 'Player789', result: 'Win', eloChange: '+25' },
    { problem: 'Climbing Stairs', date: '2023-01-22', opponent: 'Player101', result: 'Loss', eloChange: '-15' },
    { problem: 'Longest Substring', date: '2023-01-25', opponent: 'Player202', result: 'Win', eloChange: '+40' },
    { problem: 'Merge Intervals', date: '2023-01-27', opponent: 'Player303', result: 'Win', eloChange: '+30' },
    { problem: 'Minimum Path Sum', date: '2023-01-29', opponent: 'Player404', result: 'Loss', eloChange: '-25' },
    { problem: 'Word Search', date: '2023-02-01', opponent: 'Player505', result: 'Win', eloChange: '+50' },
    { problem: 'Word Search', date: '2023-02-01', opponent: 'Player505', result: 'Win', eloChange: '+50' },
    { problem: 'Longest Substring', date: '2023-01-25', opponent: 'Player202', result: 'Win', eloChange: '+40' },
    
  ];

  return (
    <Card
      withBorder
      radius="md"
      style={{
        backgroundColor: '#18181b',
        borderColor: '#27272a',
        color: '#f4f4f5',
        padding: '1rem',
        height: '100%',
        minHeight: '350px',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: inter.style.fontFamily,
      }}
    >
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Table
          striped
          highlightOnHover
          verticalSpacing="sm"
          horizontalSpacing="md"
          style={{ borderCollapse: 'collapse', width: '100%' }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'center',
                  color: '#f4f4f5',
                  paddingBottom: '0.7rem',
                  borderBottom: '1px solid #27272a',
                  fontSize: '0.85rem',
                }}
              >
                Problem
              </th>
              <th
                style={{
                  textAlign: 'center',
                  color: '#f4f4f5',
                  paddingBottom: '0.7rem',
                  borderBottom: '1px solid #27272a',
                  fontSize: '0.85rem',
                }}
              >
                Date
              </th>
              <th
                style={{
                  textAlign: 'center',
                  color: '#f4f4f5',
                  paddingBottom: '0.7rem',
                  borderBottom: '1px solid #27272a',
                  fontSize: '0.85rem',
                }}
              >
                Opponent
              </th>
              <th
                style={{
                  textAlign: 'center',
                  color: '#f4f4f5',
                  paddingBottom: '0.7rem',
                  borderBottom: '1px solid #27272a',
                  fontSize: '0.85rem',
                }}
              >
                Result
              </th>
              <th
                style={{
                  textAlign: 'center',
                  color: '#f4f4f5',
                  paddingBottom: '0.7rem',
                  borderBottom: '1px solid #27272a',
                  fontSize: '0.85rem',
                }}
              >
                ELO Change
              </th>
            </tr>
          </thead>
          <tbody>
            {matchHistory.map((match, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #27272a' }}>
                <td 
                  style={{ 
                    textAlign: 'center', 
                    padding: '0.4rem',
                    fontSize: '0.85rem',
                  }}
                >
                  {match.problem}
                </td>
                <td 
                  style={{ 
                    textAlign: 'center', 
                    padding: '0.4rem',
                    fontSize: '0.85rem',
                  }}
                >
                  {match.date}
                </td>
                <td 
                  style={{ 
                    textAlign: 'center', 
                    padding: '0.4rem',
                    fontSize: '0.85rem',
                  }}
                >
                  {match.opponent}
                </td>
                <td 
                  style={{ 
                    textAlign: 'center', 
                    padding: '0.4rem',
                    fontSize: '0.85rem',
                  }}
                >
                  {match.result}
                </td>
                <td 
                  style={{ 
                    textAlign: 'center', 
                    padding: '0.4rem',
                    fontSize: '0.85rem',
                  }}
                >
                  {match.eloChange}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
}
