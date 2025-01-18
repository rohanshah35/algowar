"use client";

import Workspace from "@/components/Practice/workspace";
import ProblemPage from "@/components/Practice/problem-page/problem-page";
import { ProblemProvider } from "@/components/Practice/ProblemData";

export default function ProblemPageWrapper() {
  return (
      <Workspace slug={"two-sum"} />
  );
}