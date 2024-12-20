"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import "./globals.css";
import AppNavbar from "./components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Note: metadata needs to be moved to a separate layout file since it can't be used
// in client components
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MantineProvider>
          <AppShell
            header={{ height: 60 }}
            padding="md"
          >
            <AppNavbar />
            {children}
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}