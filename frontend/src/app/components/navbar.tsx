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
      backgroundColor: '#18181b',
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
          <Text style={{ color: '#d4d4d8', fontSize: '24px', letterSpacing: '3px', fontFamily: inter.style.fontFamily }}>
            algowar.xyz
          </Text>
          <Group gap="md">
          </Group>
        </Box>
          <Button 
          variant="filled" 
          size="sm" 
          onClick={() => router.push('/login')}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            backgroundColor: isHovered ? '#3f3f46' : '#27272a',
            color: isHovered ? '#ffffff' : '#d4d4d8',
            border: '1px solid #3f3f46',
            borderRadius: '10px',
            fontFamily: inter.style.fontFamily,
            fontSize: '14px',
            fontWeight: 'bold',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            textShadow: isHovered ? '0px 0px 1px #ffffff' : 'none',
            transition: 'all 0.3s ease-in-out',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          LOGIN
        </Button>
      </Box>
    </AppShell.Header>
  );
};

export default AppNavbar;
