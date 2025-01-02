import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Card } from '@mantine/core';
import { useProfile } from '@/context/profile-context';

export function SparklineGraph(): React.ReactElement {
  const { stats } = useProfile();
  const { eloHistory } = stats;

  const hasData = eloHistory && eloHistory.length > 0;

  const data = hasData
    ? [
        {
          id: 'sparkline',
          data: eloHistory.map(game => ({
            x: game.month,
            y: game.elo,
          })),
        },
      ]
    : [];

  return (
    <Card
      withBorder
      radius="md"
      style={{
        height: '100%',
        backgroundColor: '#18181b',
        borderColor: '#27272a',
        color: '#f4f4f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ height: '200px', width: '100%' }}>
        {hasData ? (
          <ResponsiveLine
            data={data}
            margin={{ top: 10, right: 10, bottom: 50, left: 60 }}
            colors={['#4ADE80']}
            enableGridX={false}
            enableGridY={false}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Time',
              legendOffset: 40,
              legendPosition: 'middle',
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'ELO',
              legendOffset: -50,
              legendPosition: 'middle',
              tickValues: [0, 2000, 4000, 6000, 8000, 10000],
            }}
            yScale={{
              type: 'linear',
              min: 0,
              max: 10000,
            }}
            lineWidth={2}
            pointSize={0}
            enableArea={true}
            areaOpacity={0.15}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fill: '#B3B3B3',
                  },
                },
                legend: {
                  text: {
                    fill: '#B3B3B3',
                  },
                },
              },
            }}
          />
        ) : (
          <div
            style={{
              textAlign: 'center',
              color: '#a0a0a0',
              fontSize: '1.2rem',
              paddingTop: '80px',
            }}
          >
            No ELO history available
          </div>
        )}
      </div>
    </Card>
  );
}
