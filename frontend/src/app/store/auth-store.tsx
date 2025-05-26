"use client";

import { create } from "zustand";

interface AuthState {
  username: string | null;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  checkAuth: async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/check-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        set({ username: data.username });
      } else {
        set({ username: null });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      set({ username: null });
    }
  },
}));
