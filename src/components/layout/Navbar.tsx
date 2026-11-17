"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, signOut } = useAuth();
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="navbar-brand">
          <span className="navbar-brand-mark">Q</span>
          Qwizo
        </Link>
        <nav className="navbar-links">
          <Link href="/explore" className="navbar-link">Explore</Link>
          <Link href="/create" className="navbar-link">Create</Link>
          <Link href="/collections" className="navbar-link">Collections</Link>
          <Link href="/leaderboard" className="navbar-link">Leaderboard</Link>
        </nav>
        <div className="row">
          {user ? (
            <>
              <Link href="/progress" className="navbar-link">{user.displayName}</Link>
              <button onClick={signOut} className="navbar-link">Sign out</button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
