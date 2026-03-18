"use client";

import Link from "next/link";
import { motion } from "framer-motion";

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
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-80"
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
          className="relative z-10 mx-auto flex max-w-5xl flex-col items-center rounded-[2rem] border border-[rgba(255,255,255,0.8)] bg-white/10 px-8 py-20 text-center shadow-[0_20px_40px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_0_30px_rgba(255,255,255,0.3)] backdrop-blur-xl sm:px-12 sm:py-24"
        >
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 0.61, 0.36, 1] }}
            className="max-w-3xl text-balance text-5xl font-light leading-[1.1] tracking-tight text-black sm:text-6xl lg:text-[4.5rem]"
          >
            QUANTUM NEXT.JS<br />FRAMEWORK
          </motion.h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-black sm:text-lg">
            Build Scalable Applications with Intelligent Glassmorphism.<br />
            Faded matte dark glass design.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth?redirectTo=/dashboard"
              className="interactive-smooth inline-flex h-12 items-center justify-center rounded-2xl border border-white/60 bg-white/40 px-8 text-xs font-semibold uppercase tracking-[0.12em] text-black shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,1)] backdrop-blur-md transition-all hover:bg-white/60"
            >
              Get started
            </Link>
            <Link
              href="#how-it-works"
              className="interactive-smooth inline-flex h-12 items-center justify-center rounded-2xl border border-white/40 bg-white/20 px-7 text-xs font-semibold uppercase tracking-[0.12em] text-black/80 shadow-[0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,0.6)] backdrop-blur-md transition-all hover:bg-white/40"
            >
              Learn more
            </Link>
          </div>

          {/* The Dot: floating glass sphere with sparkle */}
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute -bottom-10 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full border border-white/60 bg-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.08),inset_0_4px_8px_rgba(255,255,255,0.9)] backdrop-blur-xl"
          >
            <svg
              className="h-6 w-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      <section id="how-it-works" className="scroll-mt-28 border-t border-[#e8e6e3] pt-16">
        <h2 className="label-caps mb-12">How it works</h2>
        <ol className="grid gap-12 sm:grid-cols-3 sm:gap-8">
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
            <li
              key={item.n}
              className="rounded-xl border border-[#e8e6e3] bg-white p-6 shadow-md shadow-black/5"
            >
              <span className="label-caps text-[#0a0a0a]">
                {item.n}
              </span>
              <p className="mt-3 text-sm font-medium text-[#0a0a0a]">
                {item.t}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">
                {item.d}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="border-t border-[#e8e6e3] pt-10">
        <p className="label-caps">
          © {new Date().getFullYear()} FAQ Studio
        </p>
      </footer>
    </main>
  );
}
