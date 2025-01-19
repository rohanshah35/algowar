"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import '@mantine/core/styles.css';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
          <ModalsProvider>
            <AppShell
              header={{ height: 60 }}
              padding="md"
            >
              {children}
            </AppShell>
            </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}