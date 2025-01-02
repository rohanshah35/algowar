"use client";

import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import EditorFooter from "@/components/Puzzle/editor-footer/editor-footer";

const Playground = ({ problem }: { problem: any }) => {
  const [userCode, setUserCode] = useState(problem.starterCode);

  const handleSubmit = () => {
    alert("Code submitted:\n" + userCode);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-dark-layer-1 p-4">
        <CodeMirror
          value={userCode}
          theme={vscodeDark}
          onChange={(value) => setUserCode(value)}
          extensions={[javascript()]}
          style={{ height: "100%", fontSize: "14px" }}
        />
      </div>
      <EditorFooter handleSubmit={handleSubmit} />
    </div>
  );
};

export default Playground;
