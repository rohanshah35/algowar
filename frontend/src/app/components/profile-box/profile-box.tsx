import { Card } from "@mantine/core";
import { UserCardImage } from "../user-card/user-card";
import { Languages } from "../language-box/languages-box";
import { Skills } from "../skills-box/skills-box";

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
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "2rem",
      }}
    >
      <UserCardImage />

      <Card
        withBorder
        padding="xl"
        radius="md"
        style={{
          backgroundColor: "#18181b",
          borderColor: "#27272a",
          color: "#f4f4f5",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
        }}
      >
        <Skills />
      </Card>

      <Card
        withBorder
        padding="xl"
        radius="md"
        style={{
          backgroundColor: "#18181b",
          borderColor: "#27272a",
          color: "#f4f4f5",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)",
        }}
      >
        <Languages />
      </Card>
    </Card>
  );
}
