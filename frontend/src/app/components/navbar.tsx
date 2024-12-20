'use client';
import React, { useEffect, useState } from 'react';
import { AppShell, Group, Text, Button, Box, Menu } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AppNavbar = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/check-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
        //   setUsername(data.username);
            setUsername("test");

        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUsername(null);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setUsername(null);
        router.push('/');
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const renderNavItems = () => {
    if (isAuthenticated === null) {
      return null;
    }

    return isAuthenticated ? (
      <>
        <Link href="/dashboard" style={{ textDecoration: 'none', color: '#a1a1aa' }}>
          Dashboard
        </Link>
        <Link href="/profile" style={{ textDecoration: 'none', color: '#a1a1aa' }}>
          Profile
        </Link>
      </>
    ) : (
      <>

      </>
    );
  };

  const renderActionButton = () => {
    if (isAuthenticated === null) {
      return null;
    }

    return isAuthenticated ? (
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button 
            variant="filled"
            size="sm"
            style={{
              backgroundColor: '#27272a',
              color: '#d4d4d8',
              border: '1px solid #3f3f46',
              borderRadius: '4px',
            }}
          >
            {username}
          </Button>
        </Menu.Target>

        <Menu.Dropdown style={{ 
          backgroundColor: '#27272a',
          border: '1px solid #3f3f46',
        }}>
          <Menu.Item 
            component={Link} 
            href="/profile"
            style={{ color: '#d4d4d8' }}
          >
            Profile
          </Menu.Item>
          <Menu.Item 
            component={Link} 
            href="/settings"
            style={{ color: '#d4d4d8' }}
          >
            Settings
          </Menu.Item>
          <Menu.Divider color="#3f3f46" />
          <Menu.Item 
            onClick={handleLogout}
            style={{ color: '#f87171' }}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    ) : (
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
    );
  };

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
            <Link href="/" style={{ textDecoration: 'none', color: '#a1a1aa' }}>
              Home
            </Link>
            {renderNavItems()}
          </Group>
        </Box>
        {renderActionButton()}
      </Box>
    </AppShell.Header>
  );
};

export default AppNavbar;