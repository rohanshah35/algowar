"use client";

import { SocialCard } from "@/components/social-card/social-card";
import { Autocomplete, AutocompleteProps, Avatar, Group, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function Social() {
  const [allUsers, setAllUsers] = useState<{ username: string; profilePicture: string }[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allUsersResponse = await fetch("http://localhost:8080/user/all", {
          credentials: "include",
        });
        if (!allUsersResponse.ok) {
          throw new Error(`Error fetching all users: ${allUsersResponse.statusText}`);
        }
        const allUsersData = await allUsersResponse.json();
        setAllUsers(allUsersData.users || []);

        const friendsResponse = await fetch(
          "http://localhost:8080/user/friends",
          { credentials: "include" }
        );
        if (!friendsResponse.ok) {
          throw new Error(`Error fetching friends: ${friendsResponse.statusText}`);
        }
        const friendsData = await friendsResponse.json();
        setFriends(friendsData.friends || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderAutocompleteOption: AutocompleteProps["renderOption"] = ({ option }) => {
    const user = allUsers.find(user => user.username === option.value);
    return (
      <Group gap="sm">
        {user?.profilePicture && <Avatar src={user.profilePicture} size={36} radius="xl" />}
        <div>
          <Text size="sm">{option.value}</Text>
        </div>
      </Group>
    );
  };

  const handleAutocompleteChange = (value: string) => {
    // Navigate to the selected user's page (replace with your desired route)
    router.push(`/u/${value}`);
  };

  if (loading) {
    return <div></div>
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ flex: 1, maxWidth: "500px" }}>
          <Autocomplete
            data={allUsers.map(user => user.username)}
            renderOption={renderAutocompleteOption}
            limit={20}
            maxDropdownHeight={300}
            placeholder="Search for users"
            onOptionSubmit={handleAutocompleteChange}  // Trigger onChange event for navigation
            styles={{
              input: {
                backgroundColor: "#27272a",
                color: "#d4d4d8",
                border: "1px solid #3f3f46",
                borderRadius: "4px",
              },
              label: { color: "#f4f4f5" },
              dropdown: {
                backgroundColor: "#27272a",
                border: "1px solid #3f3f46",
              },
              option: {
                color: "#C5C5C5",
              },
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            padding: "10px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "30px",
            }}
          >
            {friends.map((friend, index) => (
              <SocialCard key={index} username={friend} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}