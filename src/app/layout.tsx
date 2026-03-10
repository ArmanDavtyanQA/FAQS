import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FAQ Studio",
  description: "AI‑assisted FAQ generator for modern SaaS and online businesses",
};

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
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-fuchsia-500/40 blur-3xl sm:h-96 sm:w-96" />
            <div className="absolute -right-16 top-40 h-80 w-80 rounded-full bg-sky-500/40 blur-3xl sm:h-[420px] sm:w-[420px]" />
            <div className="absolute bottom-[-120px] left-1/2 h-80 w-[520px] -translate-x-1/2 rounded-[999px] bg-emerald-400/30 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0),rgba(15,23,42,0.85))]" />
          </div>
          <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-20 pt-4 sm:px-6 lg:px-8 lg:pb-24 lg:pt-6">
            <Header />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
