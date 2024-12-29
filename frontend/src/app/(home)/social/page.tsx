"use client";

import { SocialCard } from "@/components/social-card/social-card";
import { Autocomplete } from "@mantine/core";
import { useState, useEffect } from "react";

export default function Social() {
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const preferredUsername = "test"; 

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
        setAllUsers(allUsersData.usernames || []);

        const friendsResponse = await fetch(
          `http://localhost:8080/user/friends/${preferredUsername}`,
          {
            credentials: "include",
          }
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
  }, [preferredUsername]);

  if (loading) {
    return <p>Loading...</p>;
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
            label={
              <span
                style={{
                  color: "#d4d4d8",
                  fontSize: "11px",
                  fontWeight: "700",
                }}
              >
              </span>
            }
            name="identifier"
            mb="md"
            placeholder="Search for users"
            data={allUsers}
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
