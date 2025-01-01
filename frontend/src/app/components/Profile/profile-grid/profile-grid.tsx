'use client';

import { useMediaQuery } from '@mantine/hooks';
import { ProfileBox } from '../profile-box/profile-box';
import { SparklineGraph } from '../profile-graphs/sparkline';
import { DonutGraph } from '../profile-graphs/donut';
import { MatchHistory } from '../match-history/match-history';

const PRIMARY_COL_HEIGHT = '850px';

export function ProfileGrid(): React.ReactNode {
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;
  const isMobile = useMediaQuery('(max-width: 1200px)');

  return (
    <div
      style={{
        padding: '0 2rem',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '2rem',
          alignItems: isMobile ? 'center' : 'stretch',
        }}
      >
        <ProfileBox />

        <div
          style={{
            width: isMobile
              ? 'calc(100% - 300px - 2rem)'
              : 'calc(100% - 300px - 2rem)',
            minWidth: '300px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              width: '100%',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                height: SECONDARY_COL_HEIGHT,
                flex: 1,
                borderRadius: '0.375rem',
                overflow: 'hidden',
                boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.5)",
              }}
            >
              <SparklineGraph />
            </div>

            <div
              style={{
                height: SECONDARY_COL_HEIGHT,
                flex: 1,
                borderRadius: '0.375rem',
                overflow: 'hidden',
                boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.5)"
              }}
            >
              <DonutGraph />
            </div>
          </div>

          <div
            style={{
              height: SECONDARY_COL_HEIGHT,
              borderRadius: '0.375rem',
              overflow: 'hidden',
              boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.5)"
            }}
          >
            <MatchHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
