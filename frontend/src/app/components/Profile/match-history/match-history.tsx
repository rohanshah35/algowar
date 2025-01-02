import React from 'react';
import { Table, Card } from '@mantine/core';
import { Inter } from 'next/font/google';
import { useProfile } from '@/context/profile-context';

const inter = Inter({ subsets: ['latin'], weight: ['300'] });

export function MatchHistory(): React.ReactElement {
  const { stats } = useProfile();
  const { recentGames } = stats;

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
            {recentGames.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '1rem', color: '#a0a0a0', fontSize: '1.2rem' }}>
                  No matches available
                </td>
              </tr>
            ) : (
              recentGames.map((match, index) => (
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
              ))
            )}
          </tbody>
        </Table>
      </div>
    </Card>
  );
}
