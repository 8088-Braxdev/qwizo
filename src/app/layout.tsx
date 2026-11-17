import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Qwizo — Learn. Play. Connect.",
  description: "Qwizo is a social learning network. Turn your notes and documents into interactive quizzes, flashcards, and challenges.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

