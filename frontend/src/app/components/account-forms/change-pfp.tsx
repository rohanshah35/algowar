"use client";

import { Container, Paper, Avatar, Group, Text, Loader } from '@mantine/core';
import { useRef, useState, useEffect } from 'react';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import { Dropzone } from '@mantine/dropzone';
import classes from './account-forms.module.css';

export function ChangePfp() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [fetchingPfp, setFetchingPfp] = useState<boolean>(true);
  const openRef = useRef<() => void>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:8080/user/pfp', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch user profile');
        const data = await response.json();
        setProfilePicture(data.pfp);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setFetchingPfp(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleDrop = (files: File[]) => {
    const file = files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/user/update/pfp', {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile picture');
      }
      setSuccess('Profile picture updated successfully');
      setProfilePicture(data.profilePicture);
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
          <Group justify="center" mb="xl">
            {fetchingPfp ? (
              <Avatar size="120" radius={120} />
            ) : (
              <Avatar
                size={120}
                src={preview || profilePicture || '/default-avatar.png'}
                radius={120}
              />
            )}
          </Group>

          <Dropzone
            openRef={openRef}
            onDrop={handleDrop}
            className={classes.dropzone}
            radius="md"
            accept={['image/jpeg', 'image/png']}
            maxSize={5 * 1024 ** 2}
          >
            <div style={{ pointerEvents: 'none' }}>
              <Group justify="center">
                <Dropzone.Accept>
                  <IconDownload size={50} stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={50} color="red" stroke={1.5} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconCloudUpload size={50} stroke={1.5} />
                </Dropzone.Idle>
              </Group>

              <Text ta="center" fw={700} fz="lg" mt="xl" className={classes.label}>
                <Dropzone.Accept>Drop image here</Dropzone.Accept>
                <Dropzone.Reject>Image must be less than 5mb and a .jpg or .png file</Dropzone.Reject>
                <Dropzone.Idle>Upload profile picture</Dropzone.Idle>
              </Text>
              <Text ta="center" fz="sm" mt="xs" className={classes.label}>
                Drag&apos;n&apos;drop files here to upload. We can accept only <i>.jpg</i> and <i>.png</i> files that
                are less than 5mb in size.
              </Text>
            </div>
          </Dropzone>

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
              disabled={loading || !file}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Paper>
    </Container>
  );
}
