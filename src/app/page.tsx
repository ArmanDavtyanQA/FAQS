"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import GlassFeatures from "@/components/GlassFeatures";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-24 lg:gap-32">
      {/* Matte Apple glass hero with central ? motif */}
      <section className="relative mt-4 overflow-hidden rounded-[3rem] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        {/* Large 3D question mark behind glass card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10 blur-xl"
        >
          <span
            className="text-[clamp(15rem,45vw,25rem)] font-bold leading-none tracking-tight text-transparent drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)] bg-clip-text bg-gradient-to-br from-white/90 via-black/5 to-black/10"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.5)" }}
          >
            ?
          </span>
        </motion.div>

        {/* Single central glass panel */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
          className="relative z-10 mx-auto flex max-w-5xl flex-col items-center rounded-[2rem] border-t border-l border-white/60 border-b border-r border-black/[0.03] bg-white/[0.03] px-8 py-20 text-center shadow-[0_20px_50px_rgba(0,0,0,0.02)] backdrop-blur-[60px] sm:px-12 sm:py-24"
        >
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 0.61, 0.36, 1] }}
            className="max-w-3xl text-balance text-5xl font-extralight leading-[1.1] tracking-widest text-black sm:text-6xl lg:text-[4.5rem]"
          >
            QUANTUM NEXT.JS<br />FRAMEWORK
          </motion.h1>
          <p className="mt-8 max-w-2xl text-base font-light leading-relaxed tracking-widest text-black/60 sm:text-lg">
            Build Scalable Applications with Intelligent Glassmorphism.<br />
            Faded matte dark glass design.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <motion.div whileHover={{ y: -4 }} className="interactive-smooth">
              <Link
                href="/auth?redirectTo=/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-2xl border-t border-l border-white/60 border-b border-r border-black/[0.03] bg-white/[0.02] px-8 text-xs font-light uppercase tracking-widest text-black shadow-[0_20px_50px_rgba(0,0,0,0.02)] backdrop-blur-[30px] transition-all duration-500 hover:bg-white/[0.05] hover:backdrop-blur-none"
              >
                Get started
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="interactive-smooth">
              <Link
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-2xl border-t border-l border-white/60 border-b border-r border-black/[0.03] bg-white/[0.01] px-7 text-xs font-light uppercase tracking-widest text-black/80 shadow-[0_20px_50px_rgba(0,0,0,0.02)] backdrop-blur-[30px] transition-all duration-500 hover:bg-white/[0.05] hover:backdrop-blur-none"
              >
                Learn more
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <GlassFeatures />

      <section id="how-it-works" className="scroll-mt-28 pt-16 relative">
        <h2 className="label-caps mb-12 ml-4">How it works</h2>
        <div className="grid gap-6 sm:grid-cols-3 sm:gap-6 px-4">
          {[
            {
              n: "01",
              t: "Create",
              d: "Add questions and answers in the dashboard.",
            },
            {
              n: "02",
              t: "Publish",
              d: "Share your link or keep drafts private.",
            },
            {
              n: "03",
              t: "Embed",
              d: "Paste the snippet on your website.",
            },
          ].map((item) => (
            <motion.div
              key={item.n}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative rounded-[2rem] border-t border-l border-white/60 border-b border-r border-black/[0.03] bg-white/[0.01] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] backdrop-blur-[30px] transition-all duration-500"
            >
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              <div className="relative z-10">
                <span className="text-[11px] font-bold tracking-[0.2em] text-black">
                  {item.n}
                </span>
                <p className="mt-6 text-sm font-light tracking-widest text-black">
                  {item.t}
                </p>
                <p className="mt-3 text-sm font-light leading-relaxed text-black/50 transition-colors group-hover:text-black/80">
                  {item.d}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="pt-16 pb-10 flex justify-center">
        <p className="label-caps">
          © {new Date().getFullYear()} FAQ Studio
        </p>
      </footer>
    </main>
  );
}
