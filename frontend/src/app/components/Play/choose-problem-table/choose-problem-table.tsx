import React, { useState, useEffect } from "react";
import { Table, Card, Autocomplete } from "@mantine/core";

interface ProblemSummary {
  title: string;
  difficulty: string;
  acceptanceRate: number;
  slug: string;
}

interface ChooseProblemTableProps {
  onProblemSelect: (problem: ProblemSummary) => void;
}

export function ChooseProblemTable({
  onProblemSelect,
}: ChooseProblemTableProps): React.ReactElement {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<ProblemSummary[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblemTitles = async () => {
      try {
        const response = await fetch("http://localhost:8080/problem/titles");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const problemSummaries: ProblemSummary[] = data.map(
          (problem: [string, string, number, string]) => ({
            title: problem[0],
            difficulty: problem[1],
            acceptanceRate: problem[2],
            slug: problem[3],
          })
        );

        setProblems(problemSummaries);
        setFilteredProblems(problemSummaries);
      } catch (err: any) {
        setError(err.message || "Failed to fetch problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblemTitles();
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setFilteredProblems(
        problems.filter((problem) =>
          problem.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredProblems(problems);
    }
  };

  const handleRowClick = (problem: ProblemSummary) => {
    setSelectedSlug(problem.slug);
    onProblemSelect(problem);
  };

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <p style={{ color: "#F87171", textAlign: "center" }}>Error: {error}</p>
    );

  return (
    <Card
      withBorder
      radius="md"
      style={{
        backgroundColor: "#18181b",
        borderColor: "#27272a",
        color: "#f4f4f5",
        padding: "1rem",
      }}
    >
      <Autocomplete
        value={searchQuery}
        onChange={handleSearchChange}
        data={problems.map((problem) => problem.title)}
        placeholder="Search for problems"
        limit={20}
        dropdownOpened={false}
        styles={{
          input: {
            backgroundColor: "#27272a",
            color: "#d4d4d8",
            border: "1px solid #3f3f46",
            borderRadius: "4px",
            height: "40px",
            fontSize: "16px",
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
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          marginTop: "1rem",
        }}
      >
        <Table
          striped
          highlightOnHover
          verticalSpacing="md"
          horizontalSpacing="md"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "center", color: "#f4f4f5" }}>Title</th>
              <th style={{ textAlign: "center", color: "#f4f4f5" }}>
                Difficulty
              </th>
              <th style={{ textAlign: "center", color: "#f4f4f5" }}>
                Acceptance Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.map((problem) => (
              <tr
                key={problem.slug}
                style={{
                  backgroundColor:
                    selectedSlug === problem.slug
                      ? "var(--mantine-color-blue-light)"
                      : "inherit",
                  cursor: "pointer",
                }}
                onClick={() => handleRowClick(problem)}
              >
                <td style={{ textAlign: "center", padding: "0.5rem" }}>
                  {problem.title}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "0.5rem",
                    color:
                      problem.difficulty === "Easy"
                        ? "#4ADE80"
                        : problem.difficulty === "Medium"
                        ? "#FBBF24"
                        : "#F87171",
                  }}
                >
                  {problem.difficulty}
                </td>
                <td style={{ textAlign: "center", padding: "0.5rem" }}>
                  {problem.acceptanceRate}%
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
}
