"use client";
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import classes from './page-for-input.module.css';

export function ChangePassword() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Error can be a string or null
  const [success, setSuccess] = useState<string | null>(null); // Success can be a string or null
  const [oldPassword, setOldPassword] = useState<string>(''); // newUsername is a string
  const [newPassword, setNewPassword] = useState<string>(''); // newUsername is a string

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8080/user/update/password', {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update username');
      }

      setSuccess('Password updated successfully');
      setOldPassword(''); // Clear the input
      setNewPassword(''); // Clear the input
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
            <label className={classes.label}>Current password</label>
            <PasswordInput
              classNames={{ input: classes.textInput }}
              placeholder="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <label className={classes.label}>New password</label>
            <PasswordInput
              classNames={{ input: classes.textInput }}
              placeholder="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </div>
        </form>
      </Paper>
    </Container>
  );
}