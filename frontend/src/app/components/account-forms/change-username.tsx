"use client";
import {
  Container,
  Paper,
  Text,
  TextInput
} from '@mantine/core';
import { useState } from 'react';
import classes from './account-forms.module.css';

export function ChangeUsername() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8080/user/update/username', {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newUsername: newUsername
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update username');
      }

      setSuccess('Username updated successfully');
      setNewUsername('');
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className={classes.topContainer} size={460} my={30}>
      <Paper className={classes.container} withBorder shadow="md" p={30} radius="md" mt="xl">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="New username"
            placeholder="Enter new username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            required
            classNames={{ input: classes.textInput }}
          />

          {error && (
            <Text className={classes.errorText}>
              {error}
            </Text>
          )}

          {success && (
            <Text className={classes.successText}>
              {success}
            </Text>
          )}

          <div className={classes.controls}>
            <button 
              type="submit" 
              className={classes.control}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Change Username'}
            </button>
          </div>
        </form>
      </Paper>
    </Container>
  );
}
