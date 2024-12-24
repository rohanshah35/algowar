'use client';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['300'] });

import {
    IconUserCircle,
    IconSwords,
    IconPuzzle,
    IconUsersGroup,
    IconSettings,
    IconLock,
    IconChartBar,
  } from '@tabler/icons-react';
import {  Group, ScrollArea } from '@mantine/core';
import { LinksGroup } from '../navbar-links-group/navbar-links-group';
import { UserButton } from '../user-button/user-button';
import classes from './vertical-navbar.module.css';
import { useEffect, useState } from 'react';
  
  const mockdata = [
    { label: 'Profile', icon: IconUserCircle, link: '/profile' },
    {
      label: 'Play',
      icon: IconSwords,
      links: [
        { label: 'Join Queue', link: '/queue' },
        { label: 'Invite Friend', link: '/invite' },
      ],
    },
    {
      label: 'Puzzles',
      icon: IconPuzzle,
      links: [
        { label: 'Daily Puzzle', link: '/daily' },
        { label: 'By Topic', link: '/bytopic' },
      ],
    },
    { label: 'Leaderboard', icon: IconChartBar, link: '/leaderboard' },
    { label: 'Social', icon: IconUsersGroup, link: '/social' },
    { label: 'Settings', icon: IconSettings, link: '/settings' },
    {
      label: 'Account',
      icon: IconLock,
      links: [
        { label: 'Change Username', link: '/username' },
        { label: 'Change Email', link: '/email' },
        { label: 'Change Password', link: '/password' },
        { label: 'Logout', link: '/', isLogout: true },
      ],
    },
  ];

  async function checkAuth() {
    try {
      const response = await fetch("http://localhost:8080/auth/check-auth", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
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
  
  export function NavbarNested() {
    const [userData, setUserData] = useState<{ username: string; email: string } | null>(null);

    useEffect(() => {
      const fetchUserData = async () => {
        const data = await checkAuth();
        console.log(data);
        if (data) {
          setUserData({ username: data.username, email: data.email });
        }
      };

      fetchUserData();
    }, []);
    const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);
    
    if (!userData) {
      return (
        <nav className={classes.navbar}>
          <div className={classes.header}>
            <Group justify="space-between">
              <div style={{ color: '#d4d4d8', fontSize: '22px', letterSpacing: '3px', fontFamily: inter.style.fontFamily }}>
                algowar.xyz
              </div>
            </Group>
          </div>
    
          <ScrollArea className={classes.links}>
            <div className={classes.linksInner}>{links}</div>
          </ScrollArea>
    
          <div className={classes.footer}>
            <UserButton username={"Loading..."} email={"Loading..."} />
          </div>
        </nav>
      );
    }
    
    return (
      <nav className={classes.navbar}>
        <div className={classes.header}>
          <Group justify="space-between">
            <div style={{ color: '#d4d4d8', fontSize: '22px', letterSpacing: '3px', fontFamily: inter.style.fontFamily }}>
              algowar.xyz
            </div>
          </Group>
        </div>
  
        <ScrollArea className={classes.links}>
          <div className={classes.linksInner}>{links}</div>
        </ScrollArea>
  
        <div className={classes.footer}>
          <UserButton username={userData.username} email={userData.email} />
        </div>
      </nav>
    );
  }