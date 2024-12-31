import React, { useState } from "react";
import { Badge, Group, Text, Button } from "@mantine/core";

export function Skills() {
  const skills = [
    { name: "Divide and Conquer", count: 40 },
    { name: "Hash Table", count: 18 },
    { name: "Math", count: 12 },
    { name: "Array", count: 25 },
    { name: "Two Pointers", count: 22 },
    { name: "String", count: 15 },
  ];

  const [showAll, setShowAll] = useState(false);
  const visibleSkills = showAll ? skills : skills.slice(0, 3);

  return (
    <div>
      <Text
        ta="center"
        fz="lg"
        fw={500}
        style={{ color: "#f4f4f5", marginBottom: "1rem" }}
      >
        Skills
      </Text>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          maxWidth: "300px", // Limit container width for 2 items per row
          margin: "0 auto", // Center the pills container
        }}
      >
        {visibleSkills.map((skill) => (
          <Badge
            key={skill.name}
            size="lg"
            radius="md"
            style={{
              backgroundColor: "#27272a",
              color: "#f4f4f5",
              border: "1px solid #3f3f46",
              padding: "0.25rem 0.75rem",
              boxSizing: "border-box",
              textAlign: "center",
              width: "auto", // Ensure two items per row
            }}
          >
            {skill.name}: {skill.count}
          </Badge>
        ))}
      </div>
      {skills.length > 4 && (
        <Button
          variant="subtle"
          size="xs"
          onClick={() => setShowAll(!showAll)}
          style={{ color: "#f4f4f5", marginTop: "1rem" }}
        >
          {showAll ? "Show Less" : "Show More"}
        </Button>
      )}
    </div>
  );
}
