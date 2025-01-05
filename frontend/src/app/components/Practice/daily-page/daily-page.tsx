"use client";

import React, { useContext, useState, useEffect } from "react";
import Workspace from "@/components/Practice/workspace";
import ProblemData, { Problem } from "@/components/Practice/ProblemData";

// Helper function to determine the daily question
const getDailyQuestion = (problems: Problem[]): Problem => {
  const today = new Date();
  const startDate = new Date('2024-01-01'); // Fixed start date for rotation

  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const todayIndex = daysSinceStart % problems.length;

  return problems[todayIndex];
};

// Custom hook to get the current day's problem
const useCurrentDayProblem = (problems: Problem[]) => {
  const [dailyProblem, setDailyProblem] = useState<Problem | null>(null);

  useEffect(() => {
    if (problems && problems.length > 0) {
      const problem = getDailyQuestion(problems);
      setDailyProblem(problem);
    }
  }, [problems]);

  return dailyProblem;
};

const DailyPage = () => {
  const { problems, loading, error } = useContext(ProblemData);

  // Get the daily problem using the custom hook
  const dailyProblem = useCurrentDayProblem(problems || []);

  // Handle loading and error states
  if (loading) {
    return <div style={{ color: '#f4f4f5', textAlign: 'center' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: '#f87171', textAlign: 'center' }}>Error: {error}</div>;
  }

  if (!dailyProblem) {
    return <div style={{ color: '#f4f4f5', textAlign: 'center' }}>Problem not found</div>;
  }

  // Render the daily problem in the workspace
  return <Workspace problem={dailyProblem} />;
};

export default DailyPage;
