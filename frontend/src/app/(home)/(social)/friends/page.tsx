"use client";

import { SocialCard } from "@/components/Social/social-card/social-card";
import { Autocomplete, AutocompleteProps, Avatar, Group, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import styles from './Autocomplete.module.css';

export default function Social() {
  const [allUsers, setAllUsers] = useState<{ username: string; profilePicture: string }[]>([]);
  const [friends, setFriends] = useState<{ username: string; profilePicture: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

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

  const handleRemoveFriend = async (friendToDelete: string) => {
    try {
      const response = await fetch(`http://localhost:8080/user/friends/${friendToDelete}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error deleting friend: ${response.statusText}`);
      }

      setFriends(currentFriends =>
        currentFriends.filter(friend => friend.username !== friendToDelete)
      );
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

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
    router.push(`/u/${value}`);
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <div className={`container ${isDropdownOpen ? "blurred" : ""}`} style={{ paddingTop: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            flex: 1,
            maxWidth: "500px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <Autocomplete
            data={allUsers.map(user => user.username)}
            renderOption={renderAutocompleteOption}
            limit={20}
            classNames={{
              option: styles.option,
            }}
            maxDropdownHeight={300}
            placeholder="Search for users"
            onOptionSubmit={handleAutocompleteChange}
            onDropdownOpen={() => setIsDropdownOpen(true)}
            onDropdownClose={() => setIsDropdownOpen(false)}
            comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
            styles={{
              input: {
                backgroundColor: "#27272a",
                color: "#d4d4d8",
                border: "1px solid #3f3f46",
                borderRadius: "4px",
                height: isDropdownOpen ? "43px" : "40px",
                fontSize: isDropdownOpen ? "17px" : "16px",
                transition: "height 0.4s, font-size 0.4s",
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
            className="friends-list"
          >
            {friends.map((friend, index) => (
              <SocialCard
                key={index}
                username={friend.username}
                profilePicture={friend.profilePicture}
                onRemoveFriend={handleRemoveFriend}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          position: relative;
        }
        .friends-list {
          position: relative;
          z-index: 1;
          transition: filter 0.4s;
        }
        .blurred .friends-list {
          filter: blur(4px);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
