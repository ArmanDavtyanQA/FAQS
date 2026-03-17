"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-24 lg:gap-32">
      {/* Matte Apple glass hero with central ? motif */}
      <section className="relative mt-4 overflow-hidden rounded-[3rem] bg-[#FDFDFB] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        {/* Large faded question mark behind glass card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 0.18, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span className="text-[clamp(10rem,32vw,18rem)] font-semibold leading-none tracking-[0.25em] text-black/10 blur-[2px]">
            ?
          </span>
        </motion.div>

        {/* Single central glass panel */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
          className="relative z-10 mx-auto flex max-w-4xl flex-col items-center rounded-[3rem] border border-transparent border-t-white/40 border-l-white/40 border-b-black/5 border-r-black/5 bg-white/5 px-6 py-14 text-center shadow-[0_20px_80px_rgba(0,0,0,0.03)] backdrop-blur-[50px] sm:px-10 sm:py-16"
        >
          <p className="label-caps mb-4 text-slate-500/90">FAQ Studio</p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 0.61, 0.36, 1] }}
            className="max-w-2xl text-balance text-4xl font-extralight leading-[1.05] tracking-[0.08em] text-black sm:text-5xl lg:text-[3.1rem]"
          >
            Answer every question with{" "}
            <span className="text-black/60">
              matte glass clarity.
            </span>
          </motion.h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Publish a calm, glass-like FAQ surface and embed it into your site. One link, one
            widget, always up to date.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth?redirectTo=/dashboard"
              className="btn-shadow-smooth interactive-smooth inline-flex h-11 items-center justify-center rounded-3xl border border-white/40 bg-transparent px-8 text-[11px] font-light uppercase tracking-[0.18em] text-black/80 backdrop-blur-md"
            >
              Get started
            </Link>
            <Link
              href="#how-it-works"
              className="btn-shadow-smooth interactive-smooth inline-flex h-11 items-center justify-center rounded-3xl border border-white/40 bg-transparent px-7 text-[11px] font-light uppercase tracking-[0.18em] text-black/60 backdrop-blur-md"
            >
              Learn more
            </Link>
          </div>
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
