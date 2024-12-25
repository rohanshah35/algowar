'use client';

import { useState } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import { Box, Collapse, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import classes from './navbar-links-group.module.css';
import { redirect, usePathname } from 'next/navigation';

interface LinksGroupProps {
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string; isLogout?: boolean }[];
  link?: string;
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, links, link }: LinksGroupProps) {
  const pathname = usePathname();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);

  const isActive = (url: string) => pathname === url;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (link) {
      redirect(link);
    } else if (hasLinks) {
      setOpened((o) => !o);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/auth/logout", { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const items = (hasLinks ? links : []).map((link) => (
    <Text<'a'>
      component="a"
      className={`${classes.link} ${isActive(link.link) ? classes.active : ''}`}
      href={link.link}
      key={link.label}
      onClick={(e) => {
        e.preventDefault();
        if (link.isLogout) {
          handleLogout();
          redirect('/');
        } else {
          redirect(link.link);
        }
      }}
    >
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        onClick={handleClick}
        className={`${classes.control} ${link && isActive(link) ? classes.active : ''}`}
        style={{ cursor: link || hasLinks ? 'pointer' : 'default' }}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon size={30} style={{ backgroundColor: '#27272a' }}>
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              size={16}
              style={{ transform: opened ? 'rotate(-90deg)' : 'none' }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks && <Collapse in={opened}>{items}</Collapse>}
    </>
  );
}
