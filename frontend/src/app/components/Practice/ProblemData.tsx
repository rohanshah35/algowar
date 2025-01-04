"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

interface Problem {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  categories: string[];
  examples: string;
  constraints: string[];
  starterCode: string;
  testCases: string;
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
        const data: Problem[] = await response.json();
        setProblems(data);
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
