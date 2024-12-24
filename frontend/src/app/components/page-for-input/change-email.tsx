"use client";
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import classes from './page-for-input.module.css';

export function ChangeEmail() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState<string>(''); 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8080/user/update/email', {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newEmail: newEmail
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update email');
      }

      setSuccess('Email updated successfully');
      setNewEmail('');
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
          <div className={classes.inputGroup}>
            <label className={classes.label}>New email</label>
            <TextInput
              type="text"
              classNames={{ input: classes.textInput }}
              placeholder="Enter new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>

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
              {loading ? 'Updating...' : 'Change Email'}
            </button>
          </div>
        </form>
      </Paper>
    </Container>
  );
}