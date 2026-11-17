"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/types";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  signIn: (userId?: string) => Promise<void>;
  signOut: () => void;
  refresh: () => Promise<void>;
}
const Ctx = createContext<AuthCtx>({ user: null, loading: true, signIn: async () => {}, signOut: () => {}, refresh: async () => {} });

const KEY = "qwizo_uid";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function load(uid: string | null) {
    if (!uid) { setUser(null); setLoading(false); return; }
    try {
      const res = await fetch("/api/me", { headers: { "x-user-id": uid } });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    const uid = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    load(uid);
  }, []);

  async function signIn(userId?: string) {
    const id = userId || "u-demo";
    localStorage.setItem(KEY, id);
    document.cookie = `qwizo_uid=${id}; path=/; max-age=${60 * 60 * 24 * 30}`;
    await load(id);
  }

  function signOut() {
    localStorage.removeItem(KEY);
    document.cookie = "qwizo_uid=; path=/; max-age=0";
    setUser(null);
  }

  async function refresh() { await load(localStorage.getItem(KEY)); }

  return <Ctx.Provider value={{ user, loading, signIn, signOut, refresh }}>{children}</Ctx.Provider>;
}

export function useAuth() { return useContext(Ctx); }

