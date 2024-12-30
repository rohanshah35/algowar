'use client';
import React, { useState } from 'react';
import { AppShell, Group, Text, Button, Box } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['300'] });

const AppNavbar = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <AppShell.Header style={{ 
      backgroundColor: '#1A1B1E',
      borderBottom: '1px solid #27272a',
    }}>
      <Box style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        height: '100%',
        padding: '0 1rem'
      }}>
        <Box style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Text style={{ color: '#d4d4d8', fontSize: '23px', letterSpacing: '3px', fontFamily: inter.style.fontFamily }}>
            algowar.xyz
          </Text>
          <Group gap="md">
          </Group>
        </Box>
          <Button 
          variant="filled" 
          size="xs" 
          onClick={() => router.push('/login')}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            backgroundColor: isHovered ? '#2c2c30' : '#27272a',
            borderRadius: '4px',
            fontFamily: inter.style.fontFamily,
            fontSize: '13px',
            fontWeight: 300,
            letterSpacing: '2px',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          LOGIN
        </Button>
      </Box>
    </AppShell.Header>
  );
};

export default AppNavbar;
