"use client";

import { ProblemTable } from "@/components/Practice/problem-table/problem-table";
import { ProblemProvider } from "@/components/Practice/ProblemData";

export default function Problems() {
  return (
    <ProblemProvider>
          <ProblemTable />
    </ProblemProvider>
  );
}
