"use client";
import React, { useEffect, useState } from "react";
import Split from "split.js";
import ProblemDescription from "./problem-description/problem-description";
import Playground from "./playground/playground";
import styles from "./workspace.module.css";
import ProblemHeader from "./problem-header/problem-header";
import { useRouter } from "next/navigation";
import { Problem } from "./ProblemData";

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

const Workspace = ({ slug }: { slug: any }) => {
  const [problem, setProblem] = useState<any | null>(null); // Problem state
  const [code, setCode] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>("python3");
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const Router = useRouter();
  console.log(slug);
  useEffect(() => {
    console.log("test")

    const fetchProblem = async () => {
      console.log("about to call");
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
        setCode(parsedData.starterCode.python3); // Set starter code
      } catch (err: any) {
        console.error(err.message || "Failed to fetch problem");
      }
    };

    fetchProblem();
  }, []);

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
      slug: slug as string,
      code: code,
    };

    console.log("submitting code")
  };

  const handleRun = async () => {
    setIsRunning(true);
    const requestBody = {
      language: language,
      slug: slug as string,
      code: code,
    };

    try {
      console.log("Request Body:", requestBody);

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
      console.log("Run result:", result);
      setTestResults(result);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during code execution:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
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
          <div>Loading…</div>
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
          />) : (
            <div>Loading</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workspace;