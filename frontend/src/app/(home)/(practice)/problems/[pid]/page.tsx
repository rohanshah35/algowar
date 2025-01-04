"use client";

import { ProblemTable } from "@/components/Practice/problem-table/problem-table";
import ProblemPage from "@/components/Practice/problem-page/problem-page";
import { ProblemProvider } from "@/components/Practice/ProblemData";

export default function ProblemPageWrapper() {
  return (
    <ProblemProvider>
          <ProblemPage />
    </ProblemProvider>
  );
}
