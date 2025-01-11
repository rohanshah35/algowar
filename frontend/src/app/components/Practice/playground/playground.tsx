import React, { useEffect } from "react";
import Split from "split.js";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { Select } from "@mantine/core";
import EditorFooter from "@/components/Practice/editor-footer/editor-footer";
import styles from "./playground.module.css";

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
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  testResults: TestResult | null;
}

const Playground: React.FC<PlaygroundProps> = ({
  problem,
  code,
  setCode,
  language,
  setLanguage,
  testResults,
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
          }}
          data={[
            { value: "java", label: "Java" },
            { value: "python3", label: "Python 3" },
            { value: "cpp", label: "C++" },
          ]}
          styles={{
            dropdown: {
              backgroundColor: "#1e1e1e",
              border: "none",
              height: "100px",
            },
            input: {
              backgroundColor: "#1e1e1e",
              color: "#f4f4f5",
              fontSize: "12px",
              padding: "3px 6px",
              border: "none",
              marginLeft: "5px",
            },
          }}
        />
      </div>

      <div id="editor" className="bg-dark-layer-1 overflow-auto" style={{ backgroundColor: "#1e1e1e" }}>
        <CodeMirror
          value={code}
          theme={vscodeDark}
          onChange={(value) => setCode(value)}
          extensions={getCodeMirrorExtensions()}
          basicSetup={{
            tabSize: 4,
            lineNumbers: true,
          }}
          style={{ height: "100%", fontSize: "12px" }}
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