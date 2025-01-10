"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

export interface TestCase {
  input: string;
  output: string;
}

export interface Example {
  input: string;
  output: string;
}

interface StarterCode {
  python: string;
  java: string;
  c: string
  cpp: string;
}

export interface Problem {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  categories: string[];
  examples: Example[];
  constraints: string[];
  starterCode: StarterCode;
  shownTestCases: TestCase[];
  acceptanceRate: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
}

interface ProblemDataValue {
  problems: Problem[] | null;
  loading: boolean;
  error: string | null;
}

const ProblemData = createContext<ProblemDataValue>({
  problems: null,
  loading: true,
  error: null,
});

export const ProblemProvider = ({ children }: { children: ReactNode }) => {
  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("http://localhost:8080/problem/all");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const rawData = await response.json();
        
        const parsedData: Problem[] = rawData.map((problem: any) => ({
          ...problem,
          examples: JSON.parse(problem.examples),
          shownTestCases: JSON.parse(problem.shownTestCases),
          starterCode: JSON.parse(problem.starterCode)
        }));


        setProblems(parsedData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  return (
    <ProblemData.Provider value={{ problems, loading, error }}>
      {children}
    </ProblemData.Provider>
  );
};

export default ProblemData;
