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
  
  const mockdata = [
    { label: 'Profile', icon: IconUserCircle },
    {
      label: 'Play',
      icon: IconSwords,
      initiallyOpened: true,
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
  
  export function NavbarNested(props: { username: string, email: string }) {
    const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);
  
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
          <UserButton username={props.username} email={props.email} />
        </div>
      </nav>
    );
  }