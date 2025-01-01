import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Card } from '@mantine/core';

export function SparklineGraph(): React.ReactElement {
  const data = [
    {
      id: 'sparkline',
      data: [
        { x: 'Jan', y: 1500 },
        { x: 'Feb', y: 3200 },
        { x: 'Mar', y: 4500 },
        { x: 'Apr', y: 6700 },
        { x: 'May', y: 8200 },
      ],
    },
  ];

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
      <div style={{ height: '200px', width: '100%', marginBottom: '-20px' }}>
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
      </div>
    </Card>
  );
}
