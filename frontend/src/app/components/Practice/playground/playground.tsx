"use client";

import React, { useEffect, useState } from "react";
import Split from "split.js";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import EditorFooter from "@/components/Practice/editor-footer/editor-footer";
import styles from "./playground.module.css";

const Playground = ({ problem }: { problem: any }) => {
  const [userCode, setUserCode] = useState(problem.starterCode);

  const handleSubmit = () => {
    alert("Code submitted:\n" + userCode);
  };

  const handleTabChange = (value: string) => {
    console.log('Selected Tab:', value);
  };

  useEffect(() => {
    const splitInstance = Split(["#editor", "#footer"], {
      direction: "vertical",
      sizes: [60, 40],
      minSize: [100, 50],
      snapOffset: 20, 
      gutter: (index, direction) => {
        console.log(index, direction);
        const gutter = document.createElement("div");
        gutter.className = `${styles.gutter}`;
        return gutter;
      }
    });

    return () => splitInstance.destroy();

  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      <div id="editor" className="bg-dark-layer-1 overflow-auto" style={{ backgroundColor: "#1e1e1e" }}>
        <CodeMirror
          value={userCode}
          theme={vscodeDark}
          onChange={(value) => setUserCode(value)}
          extensions={[javascript()]}
          style={{ height: "100%", fontSize: "14px" }}
        />
      </div>
      <div id="footer" className="bg-dark-layer-2">
        <EditorFooter onChange={handleTabChange} />
      </div>
    </div>
  );
};

export default Playground;
