"use client";

import React, { useEffect } from "react";
import Split from "split.js";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import EditorFooter from "@/components/Practice/editor-footer/editor-footer";
import styles from "./playground.module.css";
import classes from "./playground.module.css"

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

interface PlaygroundProps {
  problem: any;
  code: string | null;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  testResults: TestResult | null;
  updateLiveCodeLineCount: (currentPlayer: number) => void;
}

const Playground: React.FC<PlaygroundProps> = ({
  problem,
  code,
  setCode,
  language,
  setLanguage,
  testResults,
  updateLiveCodeLineCount,
}) => {
  const handleTabChange = (value: string) => {
    console.log("Selected Tab:", value);
  };

  const getCodeMirrorExtensions = () => {
    switch (language) {
      case "python3":
        return [python()];
      case "cpp":
        return [cpp()];
      case "java":
        return [java()];
      default:
        return [python()];
    }
  };

  const disableCopyPaste = EditorView.domEventHandlers({
    copy: (event) => {
      event.preventDefault();
      notifications.show({
        title: "ACTION NOT ALLOWED",
        message: "Copying is disabled in competitive matches.",
        color: "red",
        position: "bottom-right",
        classNames: classes,
      });
    },
    cut: (event) => {
      event.preventDefault();
      notifications.show({
        title: "ACTION NOT ALLOWED",
        message: "Cutting is disabled in competitive matches.",
        color: "red",
        position: "bottom-right",
        classNames: classes,
      });
    },
    paste: (event) => {
      event.preventDefault();
      notifications.show({
        title: "ACTION NOT ALLOWED",
        message: "Pasting is disabled in competitive matches.",
        color: "red",
        position: "bottom-right",
        classNames: classes,
      });
    },
  });

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

  const handleCodeChange = (value: string) => {
    setCode(value);
    const lineCount = value.split('\n').length;
    updateLiveCodeLineCount(lineCount);
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div
        className="bg-dark-layer-1 p-1 flex justify-start items-center"
        style={{
          backgroundColor: "#1e1e1e",
          height: "40px",
          borderBottom: "1px solid #27272a",
        }}
      >
        <Select
          value={language}
          onChange={(value: string | null) => {
            if (value) {
              setLanguage(value);
              setCode(problem.starterCode[value]);
            }
          }}
          classNames={{
            option: styles.option,
            input: styles.input,
          }}
          data={[
            { value: "python3", label: "Python 3" },
          ]}
          styles={{
            dropdown: {
              backgroundColor: "#1e1e1e",
              borderColor: "#27272a",
              border: "1px solid #27272a",
              height: "35px",
              fontSize: "11px",
            },
          }}
        />
      </div>

      <div id="editor" className="bg-dark-layer-1 overflow-auto" style={{ backgroundColor: "#1e1e1e" }}>
        <CodeMirror
          value={code ?? ""}
          theme={vscodeDark}
          onChange={handleCodeChange}
          basicSetup={{
            tabSize: 4,
            lineNumbers: true,
          }}
          style={{ height: "100%", fontSize: "14px" }}
          extensions={[...getCodeMirrorExtensions(), disableCopyPaste]}
        />
      </div>

      <div id="footer" className="bg-dark-layer-2">
        <EditorFooter 
          onChange={handleTabChange} 
          problem={problem} 
          results={testResults} 
        />
      </div>
    </div>
  );
};

export default Playground;
