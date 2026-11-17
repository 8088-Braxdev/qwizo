"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Home, Compass, PlusCircle, Trophy, User, LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="navbar-brand">
          <span className="navbar-brand-mark">Q</span>
          Qwizo
        </Link>
        <nav className="navbar-links">
          <Link href="/explore" className="navbar-link" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><Compass size={16} /> Explore</Link>
          <Link href="/create" className="navbar-link" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><PlusCircle size={16} /> Create</Link>
          <Link href="/collections" className="navbar-link">Collections</Link>
          <Link href="/leaderboard" className="navbar-link" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><Trophy size={16} /> Leaderboard</Link>
        </nav>
        <div className="row">
          {user ? (
            <>
              <Link href="/progress" className="btn btn-ghost btn-sm" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <User size={16} /> {user.displayName}
              </Link>
              <button onClick={signOut} className="btn btn-ghost btn-sm" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">Sign in</Link>
          )}
          <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu">
          <Link href="/explore" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}><Compass size={18} /> Explore</Link>
          <Link href="/create" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}><PlusCircle size={18} /> Create</Link>
          <Link href="/collections" onClick={() => setOpen(false)}>Collections</Link>
          <Link href="/leaderboard" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}><Trophy size={18} /> Leaderboard</Link>
          {user && <Link href="/progress" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}><User size={18} /> Progress</Link>}
          {user && <button onClick={() => { signOut(); setOpen(false); }} style={{ textAlign: "left", padding: "0.75rem 1rem", background: "none", border: 0, cursor: "pointer", borderRadius: "var(--radius-sm)", color: "var(--danger)", display: "flex", alignItems: "center", gap: "0.6rem" }}><LogOut size={18} /> Sign out</button>}
        </div>
      )}
    </header>
  );
}
