"use client";

import { motion } from "framer-motion";
import { GlassHero, GlassPlans } from "@/components/glass";

export default function Home() {
  return (
    <main className="relative -mx-4 flex min-h-0 flex-1 flex-col gap-16 overflow-hidden sm:-mx-6 lg:-mx-10 lg:gap-24">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.32] [background-image:linear-gradient(rgba(31,41,55,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(31,41,55,0.14)_1px,transparent_1px)] [background-size:34px_34px]"
        aria-hidden
      />
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
          className="mb-4 text-3xl font-semibold tracking-[0.08em] text-ui-strong sm:text-4xl"
        >
          HOW IT WORKS
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 0.61, 0.36, 1] }}
          className="mb-12 max-w-2xl text-sm leading-relaxed tracking-wide text-ui-muted"
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
              className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-all duration-500"
            >
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
      </section>

      <footer className="flex justify-center pb-10 pt-16">
        <p className="label-caps">
          © {new Date().getFullYear()} FAQ Studio
        </p>
      </footer>
    </main>
  );
}
