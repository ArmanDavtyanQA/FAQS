"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Physical Glass — hero (source of truth)
 * - Refraction: bg-white/[0.01–0.05] + backdrop-blur-[60px] (large surface)
 * - Bevel: border-t/l white/60, border-b/r black/[0.03] — no uniform border-white/20
 * - Studio depth: large blurred ? at ~10% behind panel
 * - Typography: font-extralight / font-light + tracking-widest
 * - Antigravity: subtle y + blur-in on enter; hover lift on CTAs
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
        className="glass-hero-panel group relative z-10 mx-auto flex max-w-5xl flex-col items-center rounded-[2rem] px-8 py-20 text-center transition-all duration-500 sm:px-12 sm:py-24"
      >
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.06, ease: [0.22, 0.61, 0.36, 1] }}
          className="max-w-3xl text-balance text-5xl font-extralight leading-[1.1] tracking-widest text-black sm:text-6xl lg:text-[4.5rem]"
        >
          QUANTUM NEXT.JS
          <br />
          FRAMEWORK
        </motion.h1>
        <p className="mt-8 max-w-2xl text-base font-light leading-relaxed tracking-widest text-black/60 sm:text-lg">
          Build Scalable Applications with Intelligent Glassmorphism.
          <br />
          Faded matte dark glass design.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <Link
              href="/auth?redirectTo=/dashboard"
              className="glass-cta-primary interactive-smooth inline-flex h-12 items-center justify-center rounded-2xl px-8 text-xs font-light uppercase tracking-widest text-black"
            >
              Get started
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <Link
              href="#how-it-works"
              className="glass-cta-secondary interactive-smooth inline-flex h-12 items-center justify-center rounded-2xl px-7 text-xs font-light uppercase tracking-widest text-black/80"
            >
              Learn more
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
