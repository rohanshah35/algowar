import React, { useState } from "react";
import { Badge, Text, Button } from "@mantine/core";

export function Languages() {
  const languages = [
    { name: "JavaScript", count: 40 },
    { name: "React", count: 18 },
    { name: "Node.js", count: 12 },
    { name: "Python", count: 25 },
    { name: "Java", count: 22 },
    { name: "C++", count: 15 },
  ];

  const [showAll, setShowAll] = useState(false);
  const visibleLanguages = showAll ? languages : languages.slice(0, 4);

  return (
    <div>
      <Text
        ta="center"
        fz="lg"
        fw={500}
        style={{ color: "#f4f4f5", marginBottom: "1rem" }}
      >
        Languages
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
        {visibleLanguages.map((language) => (
          <Badge
            key={language.name}
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
            {language.name}: {language.count}
          </Badge>
        ))}
      </div>
      {languages.length > 4 && (
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
