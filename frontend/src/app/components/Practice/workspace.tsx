"use client";
import React, { useEffect, useState } from "react";
import Split from "split.js";
import ProblemDescription from "./problem-description/problem-description";
import Playground from "./playground/playground";
import styles from "./workspace.module.css";
import ProblemHeader from "./problem-header/problem-header";
import { useRouter } from "next/navigation";
import { useSubmissionStore } from "@/store/submission-store";

interface TestResult {
  results: Array<{
    case: number;
    error: string | null;
    expected: any;
    nums: number[];
    output: any;
    passed: boolean;
    target: number;
  }>;
}

interface TestCase {
  input: string;
  output: string;
}

interface Example {
  input: string;
  output: string;
}

interface StarterCode {
  python3: string;
  java: string;
  c: string
  cpp: string;
}

interface CategoriesObject {
  datatypes: string[];
  strategies: string[];
}

interface Problem {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  categories: CategoriesObject;
  examples: Example[];
  constraints: string[];
  starterCode: StarterCode;
  shownTestCases: TestCase[];
  acceptanceRate: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
}

const Workspace = ({ slug }: { slug: any }) => {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>("python3");
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setSubmission = useSubmissionStore((state) => state.setSubmission);
  const Router = useRouter();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await fetch(`http://localhost:8080/problem/${slug}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const rawData = await response.json();
        const parsedData: Problem = {
          ...rawData,
          examples: JSON.parse(rawData.examples),
          shownTestCases: JSON.parse(rawData.shownTestCases),
          starterCode: JSON.parse(rawData.starterCode),
          categories: JSON.parse(rawData.categories),
        };
        setProblem(parsedData);
        setCode(parsedData.starterCode.python3);
      } catch (err: any) {
        console.error(err.message || "Failed to fetch problem");
      }
    };

    fetchProblem();
  }, [slug]);

  useEffect(() => {
    const splitInstance = Split(["#description", "#playground"], {
      sizes: [50, 50],
      minSize: 300,
      snapOffset: 30,
      dragInterval: 1,
      gutterAlign: "center",
      gutter: () => {
        const gutter = document.createElement("div");
        gutter.className = `${styles.gutter}`;
        return gutter;
      },
    });

    return () => splitInstance.destroy();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const requestBody = {
      language: language,
      slug: slug,
      code: code,
    };

    try {
      const response = await fetch("http://localhost:8080/compile/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      
      // Use the Zustand store to set submission data
      setSubmission(
        result,
        code || '',
        problem?.title || '',
        language
      );

      // Optionally navigate to a results page
      Router.push('/problems/submission-result');
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    const requestBody = {
      language: language,
      slug: slug,
      code: code,
    };

    try {
      const response = await fetch("http://localhost:8080/compile/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setTestResults(result);
    } catch (error) {
      console.error("Error during code execution:", error);
      setTestResults(null);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
      <ProblemHeader 
        handleRun={handleRun} 
        handleSubmit={handleSubmit}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
      />

      <div style={{ display: "flex", height: "100%", width: "100%" }}>
        <div id="description" style={{ height: "100%", overflow: "auto" }}>
          {problem ? (
            <ProblemDescription problem={problem} />
          ) : (
            <div></div>
          )}
        </div>
        <div id="playground" style={{ height: "100%", overflow: "auto" }}>
          {problem ? (
            <Playground
              problem={problem}
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              testResults={testResults}
            />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workspace;