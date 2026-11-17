"use client";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
    </AuthProvider>
  );
}

