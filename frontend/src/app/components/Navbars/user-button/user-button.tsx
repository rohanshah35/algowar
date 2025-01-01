import { Avatar, Group, Text, UnstyledButton } from '@mantine/core';
import classes from './user-button.module.css';

export function UserButton(props: { username: string; email: string; profilePicture: string }) {
  return (
    <UnstyledButton className={classes.user}>
      <Group wrap="nowrap" style={{ alignItems: 'center' }}>
        <Avatar
          src={props.profilePicture}
          radius="xl"
          alt={`https://algowar.s3.us-west-1.amazonaws.com/profile-pictures/default.jpg`}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <Text size="sm" fw={500} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {props.username}
          </Text>

          <Text
            c="dimmed"
            size="xs"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {props.email}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  );
}
