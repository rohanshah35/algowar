import React, { useEffect, useState } from "react";
import Split from "split.js";
import ProblemDescription from "./problem-description/problem-description";
import Playground from "./playground/playground";
import styles from "./workspace.module.css";
import ProblemHeader from "./problem-header/problem-header";
import { useSubmission } from "@/context/submission-context";
import { useRouter } from "next/navigation";

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

const Workspace = ({ problem }: { problem: any }) => {
  const slug = problem.slug;
  const [code, setCode] = useState<string>(problem.starterCode.python3);
  const [language, setLanguage] = useState<string>("python3");
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setSubmission } = useSubmission();
  const Router = useRouter();

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

    try {
      const response = await fetch("http://localhost:8080/compile/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      setSubmission(result, code, problem.title, language);
      Router.push("/problems/submission-result");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during submission:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
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
          <ProblemDescription problem={problem} />
        </div>
        <div id="playground" style={{ height: "100%", overflow: "auto" }}>
          <Playground
            problem={problem}
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            testResults={testResults}
          />
        </div>
      </div>
    </div>
  );
};

export default Workspace;