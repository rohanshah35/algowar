'use client';
import React from 'react';
import { AppShell, Group, Text, Button, Box } from '@mantine/core';
import { useRouter } from 'next/navigation';

const AppNavbar = () => {
  const router = useRouter();

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
          <Text size="xl" fw={700} style={{ color: '#d4d4d8' }}>
            NodeWars
          </Text>
          <Group gap="md">
          </Group>
        </Box>
        <Button 
          variant="filled" 
          size="sm" 
          onClick={() => router.push('/login')}
          style={{
            backgroundColor: '#27272a',
            color: '#d4d4d8',
            border: '1px solid #3f3f46',
            borderRadius: '4px',
          }}
        >
          Login
        </Button>
      </Box>
    </AppShell.Header>
  );
};

export default AppNavbar;