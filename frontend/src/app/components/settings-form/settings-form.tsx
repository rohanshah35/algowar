"use client";
import {
  Container,
  Paper,
  Text,
  Select,
  Button,
  Notification,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import classes from './settings-form.module.css';

export function Settings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preferredLanguage, setPreferredLanguage] = useState<string | null>(null);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([
    'python3',
    'python',
    'Java',
    'C',
    'C++',
    'C#',
  ]);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authResponse = await fetch('http://localhost:8080/auth/check-auth', {
          method: 'POST',
          credentials: 'include',
        });
        const authData = await authResponse.json();

        if (!authResponse.ok) {
          throw new Error(authData.error || 'Failed to authenticate user');
        }

        setUsername(authData.username);

        const languageResponse = await fetch(`http://localhost:8080/user/language/${authData.username}`);
        const languageData = await languageResponse.json();

        if (!languageResponse.ok) {
          throw new Error(languageData.error || 'Failed to fetch preferred language');
        }

        setPreferredLanguage(languageData.preferredLanguage);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!username || !preferredLanguage) {
        throw new Error('User information is incomplete');
      }

      const response = await fetch('http://localhost:8080/user/update/language', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          newPreferredLanguage : preferredLanguage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update preferred language');
      }

      setSuccess('Preferred language updated successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className={classes.topContainer} size={460} my={30}>
      <Paper className={classes.container} withBorder shadow="md" p={30} radius="md" mt="xl">

        {error && (
          <Notification color="red" onClose={() => setError(null)}>
            {error}
          </Notification>
        )}

        {success && (
          <Notification color="green" onClose={() => setSuccess(null)}>
            {success}
          </Notification>
        )}

        <div className={classes.inputGroup}>
          <Text size="sm" className={classes.label} mb="xs">
            Preferred programming language
          </Text>
          <Select
            placeholder="Select your preferred language"
            value={preferredLanguage}
            onChange={(value) => setPreferredLanguage(value)}
            data={availableLanguages.map((lang) => ({ value: lang, label: lang }))}
            classNames={{
              input: classes.selectInput,
              dropdown: classes.selectDropdown,
              option: classes.selectOption,
            }}
            styles={{
              input: {
                backgroundColor: '#27272a',
              }
            }}
            disabled={loading || !username}
          />
        </div>

        <div className={classes.controls}>
          <Button
            className={classes.control}
            onClick={handleSaveChanges}
            loading={loading}
            disabled={!preferredLanguage || !username}
          >
            Save Changes
          </Button>
        </div>
      </Paper>
    </Container>
  );
}
