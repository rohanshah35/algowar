'use client';

import { Grid, SimpleGrid, Skeleton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ProfileBox } from '../profile-box/profile-box';
import { SparklineGraph } from '../graphs/sparkline'
import { DonutGraph } from '../graphs/donut'

const PRIMARY_COL_HEIGHT = '850px';

export function ProfileGrid() {
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;
  const isMobile = useMediaQuery('(max-width: 1200px)');

  return (

    <div style={{ 
      padding: '0 2rem', 
      maxWidth: '1600px', 
      margin: '0 auto', 
      width: '100%' 
    }}>

      <div style={{ 
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '2rem',
        alignItems: isMobile ? 'center' : 'stretch'
      }}>
        <ProfileBox />
        
        <div style={{ width: isMobile ? 'calc(100% - 300px - 2rem)' : 'calc(100% - 300px - 2rem)', minWidth: '300px' }}>
          <div style={{ 
              display: 'flex', 
              gap: '1rem',
              width: '100%'
            }}>
              <Skeleton 
                height={SECONDARY_COL_HEIGHT} 
                radius="md" 
                animate={false}
                style={{ flex: 1,  marginBottom: '1rem' }}
              />
              <Skeleton 
                height={SECONDARY_COL_HEIGHT} 
                radius="md" 
                animate={false}
                style={{ flex: 1,  marginBottom: '1rem' }}
              />
            </div>
            <Skeleton 
                height={SECONDARY_COL_HEIGHT} 
                radius="md" 
                animate={false}
                style={{ }}
              />
        </div>
      </div>
    </div>
  );
}