import React from "react";
import Split from "react-split";
import ProblemDescription from "./problem-description/problem-description";
import Playground from "./playground/playground";

const Workspace = ({ problem }: { problem: any }) => (
  <Split className="split" sizes={[50, 50]} minSize={300}>
    <ProblemDescription problem={problem} />
    <Playground problem={problem} />
  </Split>
);

export default Workspace;
