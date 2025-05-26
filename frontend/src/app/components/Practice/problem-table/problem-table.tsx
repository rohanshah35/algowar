'use client';

import React, { useState, useEffect } from 'react';
import { Table, Card } from '@mantine/core';
import { useRouter } from 'next/navigation';

interface ProblemSummary {
  title: string;
  difficulty: string;
  acceptanceRate: number;
  slug: string;
}

export function ProblemTable(): React.ReactElement {
  const router = useRouter();
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblemTitles = async () => {
      try {
        const response = await fetch("http://localhost:8080/problem/titles");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Transform the array response into ProblemSummary objects
        const problemSummaries: ProblemSummary[] = data.map((problem: [string, string, number, string]) => ({
          title: problem[0],
          difficulty: problem[1],
          acceptanceRate: problem[2],
          slug: problem[3]
        }));

        setProblems(problemSummaries);
      } catch (err: any) {
        setError(err.message || "Failed to fetch problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblemTitles();
  }, []);

  const handleTitleClick = (slug: string) => {
    router.push(`/problems/${slug}`);
  };

  if (loading) return <div></div>;
  if (error) return <p style={{ color: '#F87171', textAlign: 'center' }}>Error: {error}</p>;

  return (
    <Card
      withBorder
      radius="md"
      style={{
        backgroundColor: '#18181b',
        borderColor: '#27272a',
        color: '#f4f4f5',
        padding: '1rem',
      }}
    >
      <Table
        striped
        highlightOnHover
        verticalSpacing="md"
        horizontalSpacing="md"
        style={{ borderCollapse: 'collapse', width: '100%' }}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: 'center',
                color: '#f4f4f5',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #27272a',
                fontSize: '0.9rem',
              }}
            >
              Title
            </th>
            <th
              style={{
                textAlign: 'center',
                color: '#f4f4f5',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #27272a',
                fontSize: '0.9rem',
              }}
            >
              Difficulty
            </th>
            <th
              style={{
                textAlign: 'center',
                color: '#f4f4f5',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #27272a',
                fontSize: '0.9rem',
              }}
            >
              Acceptance Rate
            </th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #27272a' }}>
              <td
                style={{
                  textAlign: 'center',
                  padding: '0.5rem',
                  fontSize: '0.9rem',
                }}
              >
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTitleClick(problem.slug);
                  }}
                  style={{
                    textDecoration: 'none',
                    color: '#60A5FA',
                    cursor: 'pointer',
                  }}
                >
                  {problem.title}
                </a>
              </td>
              <td
                style={{
                  textAlign: 'center',
                  padding: '0.5rem',
                  fontSize: '0.9rem',
                  color:
                    problem.difficulty === 'Easy'
                      ? '#4ADE80'
                      : problem.difficulty === 'Medium'
                      ? '#FBBF24'
                      : '#F87171',
                }}
              >
                {problem.difficulty}
              </td>
              <td
                style={{
                  textAlign: 'center',
                  padding: '0.5rem',
                  fontSize: '0.9rem',
                }}
              >
                {problem.acceptanceRate}%
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}

export default ProblemTable;