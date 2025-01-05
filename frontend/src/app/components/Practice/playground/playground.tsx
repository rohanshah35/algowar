"use client";

import React, { useEffect, useState } from "react";
import Split from "split.js";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { Select } from "@mantine/core";
import EditorFooter from "@/components/Practice/editor-footer/editor-footer";
import styles from "./playground.module.css";

const Playground = ({ problem }: { problem: any }) => {
  const [userCode, setUserCode] = useState(problem.starterCode);
  const [language, setLanguage] = useState("python"); // Default to Python

  const handleSubmit = () => {
    alert("Code submitted:\n" + userCode);
  };

  const handleTabChange = (value: string) => {
    console.log("Selected Tab:", value);
  };

  const getCodeMirrorExtensions = () => {
    switch (language) {
      case "python":
        return [python()];
      case "cpp":
        return [cpp()];
      case "java":
        return [java()];
      default:
        return [python()];
    }
  };

  useEffect(() => {
    const splitInstance = Split(["#editor", "#footer"], {
      direction: "vertical",
      sizes: [60, 40],
      minSize: [100, 50],
      snapOffset: 20,
      gutter: (index, direction) => {
        const gutter = document.createElement("div");
        gutter.className = `${styles.gutter}`;
        return gutter;
      },
    });

    return () => splitInstance.destroy();
  }, []);

  return (
    <div className="h-full w-full flex flex-col" >
      <div
        className="bg-dark-layer-1 p-1 flex justify-start items-center"
        style={{
          backgroundColor: "#1e1e1e",
          height: "40px",
          borderBottom: "1px solid #27272a"
        }}
      >
        <Select
          value={language}
          onChange={(value) => {
            setLanguage(value!);
            setUserCode(problem.starterCode);
          }}
          data={[
            { value: "java", label: "Java" },
            { value: "python", label: "Python" },
            { value: "cpp", label: "C++" },
          ]}
          styles={{
            dropdown: {
              backgroundColor: "#1e1e1e",
              border: "none",
              height: "1  0px"
            },
            input: {
              backgroundColor: "#1e1e1e",
              color: "#f4f4f5",
              fontSize: "12px",
              padding: "3px 6px",
              border: "none",
              marginLeft: "5px"
            },
          }}
        />
      </div>

      <div id="editor" className="bg-dark-layer-1 overflow-auto" style={{ backgroundColor: "#1e1e1e" }}>
        <CodeMirror
          value={userCode}
          theme={vscodeDark}
          onChange={(value) => setUserCode(value)}
          extensions={getCodeMirrorExtensions()}
          style={{ height: "100%", fontSize: "14px" }}
        />
      </div>

      <div id="footer" className="bg-dark-layer-2">
        <EditorFooter onChange={handleTabChange} problem={problem} />
      </div>
    </div>
  );
};

export default Playground;
