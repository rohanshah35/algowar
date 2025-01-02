'use client';

import React from 'react';
import { Table, Card } from '@mantine/core';
import { useRouter } from 'next/navigation';

export function ProblemTable(): React.ReactElement {
  const router = useRouter();

  // Example filler data for the problem table
  const problems = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Array' },
    { id: 2, title: 'Reverse Linked List', difficulty: 'Hard', category: 'Linked List' },
    { id: 3, title: 'Jump Game', difficulty: 'Medium', category: 'Dynamic Programming' },
    { id: 4, title: 'Valid Parentheses', difficulty: 'Easy', category: 'Stack' },
    { id: 5, title: 'Search a 2D Matrix', difficulty: 'Medium', category: 'Binary Search' },
    { id: 6, title: 'Container With Most Water', difficulty: 'Medium', category: 'Two Pointers' },
    { id: 7, title: 'Merge Intervals', difficulty: 'Medium', category: 'Intervals' },
    { id: 8, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', category: 'Binary Tree' },
    { id: 9, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', category: 'Sliding Window' },
    { id: 10, title: 'Subsets', difficulty: 'Medium', category: 'Backtracking' },
  ];

  const handleTitleClick = (problemTitle: string) => {
    const formattedTitle = problemTitle.replace(/ /g, '-').toLowerCase(); // Convert title to slug
    router.push(`/problems/${formattedTitle}`);
  };

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
              Category
            </th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
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
                    handleTitleClick(problem.title);
                  }}
                  style={{
                    textDecoration: 'none',
                    color: '#60A5FA', // Clickable link color
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
                      : '#F87171', // Color based on difficulty
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
                {problem.category}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}

export default ProblemTable;
