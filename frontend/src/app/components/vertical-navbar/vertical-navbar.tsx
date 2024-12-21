'use client';

import {
    IconAdjustments,
    IconCalendarStats,
    IconFileAnalytics,
    IconGauge,
    IconLock,
    IconNotes,
    IconPresentationAnalytics,
  } from '@tabler/icons-react';
  import {  Group, ScrollArea } from '@mantine/core';
  import { LinksGroup } from '../navbar-links-group/navbar-links-group';
  import { UserButton } from '../user-button/user-button';
  import classes from './vertical-navbar.module.css';
  
  const mockdata = [
    { label: 'Dashboard', icon: IconGauge },
    {
      label: 'Market news',
      icon: IconNotes,
      initiallyOpened: true,
      links: [
        { label: 'Overview', link: '/' },
        { label: 'Forecasts', link: '/' },
        { label: 'Outlook', link: '/' },
        { label: 'Real time', link: '/' },
      ],
    },
    {
      label: 'Releases',
      icon: IconCalendarStats,
      links: [
        { label: 'Upcoming releases', link: '/' },
        { label: 'Previous releases', link: '/' },
        { label: 'Releases schedule', link: '/' },
      ],
    },
    { label: 'Analytics', icon: IconPresentationAnalytics },
    { label: 'Contracts', icon: IconFileAnalytics },
    { label: 'Settings', icon: IconAdjustments },
    {
      label: 'Security',
      icon: IconLock,
      links: [
        { label: 'Enable 2FA', link: '/' },
        { label: 'Change password', link: '/' },
        { label: 'Recovery codes', link: '/' },
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
              NodeWars
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