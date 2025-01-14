'use client';

import React, { useContext } from 'react';
import { Table, Card } from '@mantine/core';
import { useRouter } from 'next/navigation';
import ProblemData from '@/components/Practice/ProblemData';

export function ProblemTable(): React.ReactElement {
  const router = useRouter();
  const { problems, loading, error } = useContext(ProblemData);
  
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
          {problems?.map((problem) => (
            <tr key={problem.id} style={{ borderBottom: '1px solid #27272a' }}>
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
