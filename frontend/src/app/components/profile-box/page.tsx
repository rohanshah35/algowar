import { Card, Text } from "@mantine/core";
import { UserCardImage } from "../user-card/page";
import { Languages } from "../language-box/languages";
import { Skills } from "../skills-box/skills";

export function ProfileBox() {
  return (
    <Card
      withBorder
      padding="xl"
      radius="md"
      style={{
        minHeight: "800px",
        backgroundColor: "#18181b",
        borderColor: "#27272a",
        color: "#f4f4f5",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
      }}
    >
      {/* Top Section: User Info and Stats */}
      <UserCardImage />

      {/* Other Sections: You can add your own content below */}
      <div style={{ marginTop: "2rem" }}>
        {/* Recent Activity Card */}
        <Card
          withBorder
          padding="xl"
          radius="md"
          style={{
            marginBottom: "1rem",
            backgroundColor: "#18181b",
            borderColor: "#27272a",
            color: "#f4f4f5",
            // boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
          }}
        >
          <Skills />
        </Card>

        {/* Friends List Card */}
        <Card
          withBorder
          padding="xl"
          radius="md"
          style={{
            backgroundColor: "#18181b",
            borderColor: "#27272a",
            color: "#f4f4f5",
            // boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
          }}
        >
          <Languages />
        </Card>
      </div>
    </Card>
  );
}
