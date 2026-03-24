"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const publishedFaqHref =
  typeof process.env.NEXT_PUBLIC_LANDING_PUBLISHED_FAQ_USER_ID === "string" &&
  process.env.NEXT_PUBLIC_LANDING_PUBLISHED_FAQ_USER_ID.length >= 10
    ? `/faq/${process.env.NEXT_PUBLIC_LANDING_PUBLISHED_FAQ_USER_ID}`
    : "#plans";

/**
 * Physical Glass — hero
 * - Primary title: QUANTUM — Geist Sans, extralight, tracking-widest
 * - Option 1 mono block below: START SMALL. / BUILD BEYOND. (font-mono, 72px)
 * - Panel: .glass-hero-panel — 80px blur, specular border-top white/60
 * - Depth: blurred ? motif behind card
 */
export default function GlassHero() {
  return (
    <section className="relative mt-4 overflow-hidden rounded-[3rem] bg-[#FDFDFB] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
      {/* Studio depth: 3D ? motif — low opacity, blurred, behind glass */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 0.61, 0.36, 1] }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <motion.span
          aria-hidden
          initial={{ filter: "blur(8px)" }}
          animate={{ filter: "blur(4px)" }}
          transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
          className="text-[clamp(15rem,45vw,25rem)] font-extralight leading-none tracking-widest text-black/[0.1]"
          style={{ WebkitTextStroke: "1px rgba(255,255,255,0.45)" }}
        >
          ?
        </motion.span>
      </motion.div>

      {/* Floating depth blob (refractive field, not solid gray) */}
      <div className="pointer-events-none absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-white/[0.04] blur-[80px]" />
      <div className="pointer-events-none absolute -left-16 bottom-1/4 h-56 w-56 rounded-full bg-black/[0.02] blur-[80px]" />

      {/* Large glass panel — extreme blur + specular bevel */}
      <motion.div
        initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.95, ease: [0.22, 0.61, 0.36, 1] }}
        whileHover={{ y: -4 }}
        className="glass-hero-panel group relative z-10 mx-auto flex max-w-5xl flex-col items-center rounded-[2rem] px-6 py-16 text-center transition-all duration-500 sm:px-10 sm:py-20 lg:px-12 lg:py-24"
      >
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.06, ease: [0.22, 0.61, 0.36, 1] }}
          className="max-w-3xl text-balance text-5xl font-extralight leading-[1.1] tracking-widest text-black sm:text-6xl lg:text-[4.5rem]"
        >
          QUANTUM
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 0.61, 0.36, 1] }}
          className="font-mono mt-8 max-w-[min(100%,42rem)] text-balance text-center"
          aria-label="START SMALL BUILD BEYOND"
        >
          <span className="block text-[72px] font-extralight uppercase leading-[1.1] tracking-[-0.02em] text-black">
            START SMALL
          </span>
          <span className="mt-2 block text-[72px] font-medium uppercase leading-[1.1] tracking-[-0.02em] text-black">
            BUILD BEYOND
          </span>
        </motion.div>

        <p className="mt-10 max-w-xl font-sans text-base font-light leading-relaxed text-black/60 sm:text-lg">
          From 3 topics to unlimited AI-driven design. Quantum scales your
          support from free to Pro in one click.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <Link
              href="/dashboard"
              className="glass-cta-primary interactive-smooth inline-flex h-12 items-center justify-center rounded-2xl px-8 text-xs font-light uppercase tracking-widest text-black"
            >
              Dashboard
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <Link
              href={publishedFaqHref}
              className="glass-cta-secondary interactive-smooth inline-flex h-12 items-center justify-center rounded-2xl px-7 text-xs font-light uppercase tracking-widest text-black/80"
            >
              View published FAQs
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
