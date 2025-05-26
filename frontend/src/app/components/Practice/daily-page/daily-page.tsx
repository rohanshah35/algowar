"use client";

import React, { useState, useEffect } from "react";
import Workspace from "@/components/Practice/workspace";

interface ProblemSummary {
  title: string;
  difficulty: string;
  acceptanceRate: number;
  slug: string;
}

const getDailySlug = (problems: ProblemSummary[]): string => {
  const today = new Date();
  const startDate = new Date('2024-01-01');

  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const todayIndex = daysSinceStart % problems.length;

  return problems[todayIndex].slug;
};

const useCurrentDaySlug = (problems: ProblemSummary[]) => {
  const [dailySlug, setDailySlug] = useState<string | null>(null);

  useEffect(() => {
    if (problems && problems.length > 0) {
      const slug = getDailySlug(problems);
      setDailySlug(slug);
    }
  }, [problems]);

  return dailySlug;
};

const DailyPage = () => {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
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

    fetchProblems();
  }, []);

  const dailySlug = useCurrentDaySlug(problems);

  if (loading) {
    return <div style={{ color: '#f4f4f5', textAlign: 'center' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: '#f87171', textAlign: 'center' }}>Error: {error}</div>;
  }

  if (!dailySlug) {
    return <div style={{ color: '#f4f4f5', textAlign: 'center' }}>Problem not found</div>;
  }

  return <Workspace slug={dailySlug} />;
};

export default DailyPage;