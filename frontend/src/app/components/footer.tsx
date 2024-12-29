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
        <Text size="sm" style={{ letterSpacing: '2px', fontFamily: inter.style.fontFamily }}> 
          algowar.xyz
        </Text>

        <Group className={classes.links} style={{ fontSize: '12px', fontFamily: inter.style.fontFamily }}>
          Created by Luca Bianchini and Rohan Shah
        </Group>

        <Group justify="center">
          <ActionIcon 
            size="md" 
            variant="default" 
            radius="xl" 
            component="a" 
            href="https://github.com/rohanshah35/algowar"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBrandGithub size={18} stroke={2} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}
