import React, { useEffect } from "react";
import Split from "split.js";
import ProblemDescription from "./problem-description/problem-description";
import Playground from "./playground/playground";
import styles from "./workspace.module.css";
import ProblemHeader from "./problem-header/problem-header";

const Workspace = ({ problem }: { problem: any }) => {
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
    alert("Code submitted:\n");
  };

  const handleRun = () => {
    alert("Code ran:\n");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
      <ProblemHeader handleRun={handleRun} handleSubmit={handleSubmit} />

      <div style={{ display: "flex", height: "100%", width: "100%" }}>
        <div id="description" style={{ height: "100%", overflow: "auto" }}>
          <ProblemDescription problem={problem} />
        </div>
        <div id="playground" style={{ height: "100%", overflow: "auto" }}>
          <Playground problem={problem} />
        </div>
      </div>
    </div>
  );
};

export default Workspace;
