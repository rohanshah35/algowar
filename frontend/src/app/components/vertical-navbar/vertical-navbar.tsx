'use client';

import {
    IconUserCircle,
    IconSwords,
    IconPuzzle,
    IconUsersGroup,
    IconSettings,
    IconLock,
    IconChartBar,
    IconPresentationAnalytics,
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
        { label: 'Join Queue', link: '/' },
        { label: 'Invite Friend', link: '/' },
      ],
    },
    {
      label: 'Puzzles',
      icon: IconPuzzle,
      links: [
        { label: 'Daily Puzzle', link: '/' },
        { label: 'By Topic', link: '/' },
      ],
    },
    { label: 'Leaderboard', icon: IconChartBar },
    { label: 'Social', icon: IconUsersGroup },
    { label: 'Settings', icon: IconSettings },
    {
      label: 'Account',
      icon: IconLock,
      links: [
        { label: 'Change Username', link: '/' },
        { label: 'Change Email', link: '/' },
        { label: 'Change Password', link: '/' },
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
            <div style={{ color: '#d4d4d8', fontSize: '28px', fontWeight: 700 }}>
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