"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-24 lg:gap-32">
      {/* Apple Glass-style hero with glassmorphism and motion */}
      <section className="relative mt-2 overflow-hidden rounded-[2.5rem] border border-[#d6d4ce]/70 bg-gradient-to-br from-[#050816] via-[#0b1020] to-[#120320] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        {/* Blurred mesh gradient background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-32 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_top,_#60a5fa_0%,_transparent_60%)] opacity-60 blur-3xl md:h-80 md:w-80" />
          <div className="absolute -right-16 top-10 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_top,_#a855f7_0%,_transparent_60%)] opacity-60 blur-3xl md:h-96 md:w-96" />
          <div className="absolute bottom-[-6rem] left-1/2 h-80 w-[460px] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(circle_at_bottom,_#22d3ee_0%,_transparent_65%)] opacity-60 blur-3xl md:w-[560px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.85),transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_55%)]" />
        </div>

        {/* Frosted glass content container */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
          className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-[1.9rem] border border-white/10 bg-white/8 px-5 py-8 shadow-[0_40px_160px_rgba(0,0,0,0.75)] backdrop-blur-2xl sm:px-8 sm:py-10 lg:flex-row lg:items-center lg:px-10"
        >
          <div className="flex-1 space-y-7">
            <p className="label-caps text-slate-200/80">Glass FAQ studio</p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 0.61, 0.36, 1] }}
              className="max-w-xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-slate-50 sm:text-5xl lg:text-[3.2rem]"
            >
              <span className="bg-gradient-to-r from-slate-100 via-zinc-200 to-slate-50 bg-clip-text text-transparent">
                Crystal-clear FAQs,
              </span>{" "}
              floating on glass.
            </motion.h1>
            <p className="max-w-md text-sm leading-relaxed text-slate-200/80 sm:text-[0.95rem]">
              Give your customers a high-end support experience. Host a glassy FAQ hub and embed it
              on any site with one snippet—always on, always in sync.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.14, ease: [0.22, 0.61, 0.36, 1] }}
                className="flex flex-wrap gap-3"
              >
                <Link
                  href="/auth?redirectTo=/dashboard"
                  className="btn-shadow-smooth btn-solid-edge interactive-smooth inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-b from-white via-zinc-100 to-zinc-200 px-7 text-[11px] font-medium uppercase tracking-[0.16em] text-[#050816]"
                >
                  Start free workspace
                </Link>
                <a
                  href="#how-it-works"
                  className="btn-shadow-smooth btn-ghost-edge interactive-smooth inline-flex h-11 items-center justify-center rounded-2xl bg-white/5 px-6 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-50/90"
                >
                  See how it works
                </a>
              </motion.div>
              <p className="text-[11px] text-slate-200/70">
                No code. One glass page, one embed.
              </p>
            </div>
          </div>

          {/* Floating preview card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
            className="mt-2 flex-1 lg:mt-0"
          >
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-4 rounded-[1.6rem] bg-gradient-to-br from-white/18 via-sky-400/10 to-fuchsia-400/15 opacity-70 blur-xl" />
              <div className="relative rounded-[1.6rem] border border-white/18 bg-white/8 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-200/80">
                      Public FAQ
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-50">
                      help.yourbrand.com
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    Live
                  </span>
                </div>

                <div className="mt-4 rounded-xl border border-white/14 bg-slate-950/40 p-3">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300/80">
                    Frequently asked
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-100/90">
                    <li className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                      <span>How do I update answers?</span>
                      <span className="text-[10px] text-slate-300/80">Open</span>
                    </li>
                    <li className="flex items-center justify-between rounded-lg bg-white/0 px-3 py-2 hover:bg-white/4">
                      <span>Can I embed this on my site?</span>
                      <span className="text-[10px] text-slate-400/80">Click</span>
                    </li>
                    <li className="flex items-center justify-between rounded-lg bg-white/0 px-3 py-2 hover:bg-white/4">
                      <span>Do I need a developer?</span>
                      <span className="text-[10px] text-slate-400/80">Answer</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 rounded-xl border border-dashed border-cyan-300/35 bg-cyan-400/8 p-3">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-100">
                    Embed snippet
                  </p>
                  <p className="mt-2 truncate rounded-lg bg-black/60 px-3 py-2 text-[10px] text-cyan-100/90">
                    {`<script src=\"https://faq.studio/widget.js\" data-faq-id=\"brand\"></script>`}
                  </p>
                </div>
              </div>
            </div>
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
