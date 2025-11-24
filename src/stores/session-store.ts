"use client";

import { create } from "zustand";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "company" | "siteManager";
};

type SessionState = {
  user: SessionUser | null;
  setUser: (user: SessionUser | null) => void;
  clear: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
}));
