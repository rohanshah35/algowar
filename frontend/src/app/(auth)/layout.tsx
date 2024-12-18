"use client";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-800">
        {children}
      </div>
    </MantineProvider>
  );
}
