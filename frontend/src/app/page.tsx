// import { Container } from "@mantine/core";
import AppNavbar from "./components/navbar";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Footer } from "./components/footer";

import { Button, Container, Group, Text } from '@mantine/core';
import classes from './landing-page.module.css';

async function checkAuth() {
  try {
    const cookieStore = await cookies();
    const response = await fetch("http://localhost:8080/auth/check-auth", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
}

export default async function Home() {
  const auth = await checkAuth();
  if (auth) {
    redirect('/profile')
  } 

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <AppNavbar />
      <Container size="lg" style={{ flex: 1 }}>
        <div className={classes.wrapper}>
          <Container size={1100} className={classes.inner}>
              <h1 className={classes.title}>
                A{' '}
                <Text 
                  component="span" 
                  variant="gradient" 
                  gradient={{ from: '#ff4d4d', to: '#ff8080' }}
                  inherit
                >
                competitive platform 
                </Text>{' '}
                to master coding skills
              </h1>

            <Text className={classes.description} color="dimmed">
              Take your coding preparation to the next level with algowar.xyz – engage in head-to-head coding
              battles with friends, climb the leaderboard, and tackle interview-style problems in an exciting
              and interactive way.
            </Text>

            <Group className={classes.controls}>
              <Button
                size="xl"
                className={classes.control}
                variant="gradient"
                gradient={{ from: '#ff4d4d', to: '#ff8080' }}
              >
                Play As Guest
              </Button>

        </Group>
      </Container>
    </div>
      </Container>
      <Footer />
    </div>
  );
}
