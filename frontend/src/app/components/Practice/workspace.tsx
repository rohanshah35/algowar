import React, { useEffect, useState } from "react";
import Split from "split.js";
import ProblemDescription from "./problem-description/problem-description";
import Playground from "./playground/playground";
import styles from "./workspace.module.css";
import ProblemHeader from "./problem-header/problem-header";

const Workspace = ({ problem }: { problem: any }) => {
  const slug = problem.slug;

  const [code, setCode] = useState<string>(problem.starterCode.python);
  const [language, setLanguage] = useState<string>("python3");

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

  const handleSubmit = () => {
    alert("Code submitted:\n" + code + "\nLanguage: " + language);
  };

  const handleRun = async () => {
    const normalizedCode = code
      .split("\n")
      .map((line, index) => {
        if (index === 0) {
          return line.trim();
        }
        return line.trim() ? "    " + line.trim() : "";
      })
      .join("\n");
  
    const requestBody = {
      language: language,
      slug: slug as string,
      code: normalizedCode,
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
  
      alert(`Run result: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during code execution:", error.message);
        alert(`Error: ${error.message}`);
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
      <ProblemHeader handleRun={handleRun} handleSubmit={handleSubmit} />

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
          />
        </div>
      </div>
    </div>
  );
};

export default Workspace;
