"use client";

import { motion } from "framer-motion";
import { GlassHero, GlassFeatures } from "@/components/glass";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-24 lg:gap-32">
      <GlassHero />

      <GlassFeatures />

      <section id="how-it-works" className="relative scroll-mt-28 bg-[#FDFDFB] px-6 pt-16">
        <motion.h2
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          className="label-caps mb-12 ml-0"
        >
          How it works
        </motion.h2>
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-3 sm:gap-6">
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
              className="glass-feature-card group relative rounded-[2rem] p-8 transition-all duration-500"
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

      <footer className="flex justify-center pb-10 pt-16">
        <p className="label-caps">
          © {new Date().getFullYear()} FAQ Studio
        </p>
      </footer>
    </main>
  );
}
