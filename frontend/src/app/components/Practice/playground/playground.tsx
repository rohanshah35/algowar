"use client";

import React, { useEffect, useState } from "react";
import Split from "split.js";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import EditorFooter from "@/components/Practice/editor-footer/editor-footer";

const Playground = ({ problem }: { problem: any }) => {
  const [userCode, setUserCode] = useState(problem.starterCode);

  const handleSubmit = () => {
    alert("Code submitted:\n" + userCode);
  };

  useEffect(() => {
    // Initialize horizontal split for the Playground
    Split(["#editor", "#footer"], {
      direction: "vertical",
      sizes: [85, 15], // Initial sizes as percentages
      minSize: [100, 50], // Minimum sizes for editor and footer
      gutterSize: 10, // Gutter size
      snapOffset: 20, // Snap-back threshold
    });
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      <div id="editor" className="bg-dark-layer-1 overflow-auto">
        <CodeMirror
          value={userCode}
          theme={vscodeDark}
          onChange={(value) => setUserCode(value)}
          extensions={[javascript()]}
          style={{ height: "100%", fontSize: "14px" }}
        />
      </div>
      <div id="footer" className="bg-dark-layer-2">
        <EditorFooter handleSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Playground;
