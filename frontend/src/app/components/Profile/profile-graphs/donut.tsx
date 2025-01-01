import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Card } from '@mantine/core';

export function DonutGraph(): React.ReactNode {
  const data = [
    { id: 'Easy', label: 'Easy', value: 50 },
    { id: 'Medium', label: 'Medium', value: 30 },
    { id: 'Hard', label: 'Hard', value: 20 },
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
      <div style={{ height: '200px', width: '100%' }}>
        <ResponsivePie
          data={data}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          innerRadius={0.7}
          padAngle={1}
          cornerRadius={3}
          colors={['#4ADE80', '#FBBF24', '#F87171']}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor="#FFFFFF"
          enableArcLinkLabels={true}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#B3B3B3"
          arcLinkLabelsThickness={1}
          arcLinkLabelsColor={{ from: 'color' }}
        />
      </div>
    </Card>
  );
}
