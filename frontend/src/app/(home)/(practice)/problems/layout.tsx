"use client";

import { SubmissionProvider } from "@/context/submission-context";

export default function ProblemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubmissionProvider>
      <div>{children}</div>
    </SubmissionProvider>
  );
}
