"use client";
import {
  Container,
  Paper,
  PasswordInput,
  Text
} from '@mantine/core';
import { useState } from 'react';
import classes from './account-forms.module.css';

export function ChangePassword() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

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
        throw new Error(data.error || 'Failed to update password');
      }

      setSuccess('Password updated successfully');
      setOldPassword('');
      setNewPassword('');
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
          <PasswordInput
            label="Current password"
            classNames={{ input: classes.textInput }}
            placeholder="Enter current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <PasswordInput
            label="New password"
            classNames={{ input: classes.textInput }}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            mt="md"
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
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </div>
        </form>
      </Paper>
    </Container>
  );
}
