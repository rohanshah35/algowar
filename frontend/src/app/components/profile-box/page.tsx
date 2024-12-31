import { Card, Text } from "@mantine/core";
import { UserCardImage } from "../user-card/page";

export function ProfileBox() {
    return (
      <Card withBorder padding="xl" radius="md" style={{ minHeight: '800px' }}>
        {/* Top Section: User Info and Stats */}
        <UserCardImage />
  
        {/* Other Sections: You can add your own content below */}
        <div style={{ marginTop: '2rem' }}>
          <Card withBorder padding="xl" radius="md" style={{ marginBottom: '1rem' }}>
            <Text ta="center" fz="xl" fw={500}>
              Recent Activity
            </Text>
            <Text ta="center" fz="sm" c="dimmed">
              Here is the user's recent activity
            </Text>
          </Card>
  
          <Card withBorder padding="xl" radius="md">
            <Text ta="center" fz="xl" fw={500}>
              Friends List
            </Text>
            <Text ta="center" fz="sm" c="dimmed">
              Here's a list of friends
            </Text>
          </Card>
        </div>
      </Card>
    );
  }