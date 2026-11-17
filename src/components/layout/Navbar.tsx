"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, signOut } = useAuth();
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-40">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-700">
          <span className="inline-block w-8 h-8 rounded-lg bg-blue-500 text-white grid place-items-center">Q</span>
          Qwizo
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
          <Link href="/explore" className="hover:text-blue-700">Explore</Link>
          <Link href="/create" className="hover:text-blue-700">Create</Link>
          <Link href="/collections" className="hover:text-blue-700">Collections</Link>
          <Link href="/leaderboard" className="hover:text-blue-700">Leaderboard</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/progress" className="text-sm text-slate-700 hover:text-blue-700">{user.displayName}</Link>
              <button onClick={signOut} className="text-sm text-slate-500 hover:text-slate-900">Sign out</button>
            </>
          ) : (
            <Link href="/login" className="btn-primary text-sm">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}

