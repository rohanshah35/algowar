import { IconBrandInstagram, IconBrandGithub, IconBrandYoutube } from '@tabler/icons-react';
import { ActionIcon, Anchor, Group, Text } from '@mantine/core';
import { Inter } from 'next/font/google';
import classes from './footer.module.css';

const inter = Inter({ subsets: ['latin'], weight: ['300'] });

// const links = [
//   { link: '#', label: 'GitHub' },
// ];

export function Footer() {
  // const items = links.map((link) => (
  //   <Anchor
  //     key={link.label}
  //     href={link.link}
  //     size="sm"
  //     color="dimmed"
  //     style={{ lineHeight: 1 }}
  //   >
  //     {link.label}
  //   </Anchor>
  // ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Text size="xs" style={{ letterSpacing: '2px', fontFamily: inter.style.fontFamily }}> 
          algowar.xyz
        </Text>

        <Group className={classes.links} style={{ fontSize: '12px', fontFamily: inter.style.fontFamily }}>
          Created by
          <Anchor
            size="xs"
            href="https://github.com/lfbianchini"
            target="_blank"
            rel="noopener noreferrer"
            underline="never"
          >
            Luca Bianchini
          </Anchor>
          and
          <Anchor
            size="xs"
            href="https://github.com/rohanshah35"
            target="_blank"
            rel="noopener noreferrer"
            underline="never"
          >
            Rohan Shah
          </Anchor>
        </Group>

        <Group justify="center">
        <ActionIcon
          size="md"
          variant="filled"
          color="dark"
          radius="xl"
          component="a"
          href="https://github.com/rohanshah35/algowar"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#1A1B1E',
            transition: 'none',
          }}
        >
          <IconBrandGithub size={18} stroke={2} color="white" />
        </ActionIcon>
        </Group>
      </div>
    </div>
  );
}
