"use client";

import { motion } from "framer-motion";
import { GlassHero, GlassPlans } from "@/components/glass";

export default function Home() {
  return (
    <main className="flex min-h-0 flex-1 flex-col gap-16 lg:gap-24">
      <GlassHero />

      <GlassPlans />

      <section
        id="how-it-works"
        className="relative scroll-mt-28 bg-transparent px-6 pt-16"
      >
        <motion.h2
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          className="mb-4 text-3xl font-extralight tracking-[0.2em] text-slate-900 sm:text-4xl"
        >
          HOW IT WORKS
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 0.61, 0.36, 1] }}
          className="mb-12 max-w-2xl text-sm font-light leading-relaxed tracking-wide text-slate-600"
        >
          Three steps from your dashboard to a live FAQ your visitors can use.
        </motion.p>
        <div className="relative mx-auto grid max-w-7xl gap-6 sm:grid-cols-3 sm:gap-6">
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
          ].map((item, i) => (
            <motion.div
              key={item.n}
              initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.65, delay: i * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white/95 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-500"
            >
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
                aria-hidden
              >
                <div className="absolute -left-[18%] bottom-[-32%] h-[min(18rem,55vw)] w-[min(28rem,95%)] rounded-full bg-gradient-to-tr from-slate-400/10 via-indigo-500/8 to-transparent blur-[72px]" />
              </div>
              <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/50 via-transparent to-indigo-500/[0.04] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              <div className="relative z-10">
                <span className="text-[11px] font-bold tracking-[0.2em] text-slate-900">
                  {item.n}
                </span>
                <p className="mt-6 text-sm font-light tracking-widest text-slate-800">
                  {item.t}
                </p>
                <p className="mt-3 text-sm font-light leading-relaxed text-slate-600 transition-colors group-hover:text-slate-800">
                  {item.d}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        <div
          className="pointer-events-none absolute right-0 top-1/3 h-64 w-64 translate-x-1/3 rounded-full bg-gradient-to-tr from-slate-400/12 via-indigo-400/8 to-transparent blur-[80px]"
          aria-hidden
        />
      </section>

      <footer className="flex justify-center pb-10 pt-16">
        <p className="label-caps">
          © {new Date().getFullYear()} FAQ Studio
        </p>
      </footer>
    </main>
  );
}
