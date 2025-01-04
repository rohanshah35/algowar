"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

interface TestCase {
  input: string;
  output: string;
}

interface Example {
  input: string;
  output: string;
}

// Interface for the raw problem data from the API
interface RawProblem {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  categories: string[];
  examples: string; // String representation of JSON
  constraints: string[];
  starterCode: string;
  testCases: string; // String representation of JSON
  acceptanceRate: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
}

// Interface for the parsed problem data
interface Problem {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  categories: string[];
  examples: Example[];
  constraints: string[];
  starterCode: string;
  testCases: TestCase[];
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
        const rawData: RawProblem[] = await response.json();
        
        const parsedData: Problem[] = rawData.map((problem) => ({
          ...problem,
          examples: JSON.parse(problem.examples) as Example[],
          testCases: JSON.parse(problem.testCases) as TestCase[]
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