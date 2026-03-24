"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const landingPublishedUserId =
  typeof process.env.NEXT_PUBLIC_LANDING_PUBLISHED_FAQ_USER_ID === "string"
    ? process.env.NEXT_PUBLIC_LANDING_PUBLISHED_FAQ_USER_ID.trim()
    : "";
const hasLandingPublishedFaq = landingPublishedUserId.length >= 10;
const publishedFaqUrl = hasLandingPublishedFaq
  ? `/faq/${landingPublishedUserId}`
  : null;

/** Shared hero CTA look (Dashboard + conditional 2nd action). */
const heroCtaClassName =
  "glass-cta-primary interactive-smooth inline-flex h-12 items-center justify-center rounded-2xl px-8 text-xs font-light uppercase tracking-widest text-black";

/**
 * Physical Glass — hero
 * - Fills viewport below fixed header (LayoutShell pt) and centers content vertically
 * - Primary title: QUANTUM — responsive scale, not full 4.5rem on laptop
 * - Mono block: clamp() so START SMALL / BUILD BEYOND fit ~13–16" screens
 * - Panel: .glass-hero-panel — specular bevel; depth ? motif behind
 */
export default function GlassHero() {
  return (
    <section className="relative mt-0 flex min-h-[calc(100dvh-7.5rem)] flex-col justify-center overflow-hidden rounded-[3rem] bg-[#FDFDFB] px-4 py-8 sm:px-6 sm:py-10 lg:min-h-[calc(100dvh-8.5rem)] lg:px-10 lg:py-12">
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
          className="text-[clamp(10rem,32vw,18rem)] font-extralight leading-none tracking-widest text-black/[0.1]"
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
        className="glass-hero-panel group relative z-10 mx-auto flex max-w-5xl flex-col items-center rounded-[2rem] px-5 py-8 text-center transition-all duration-500 sm:px-8 sm:py-10 lg:px-10 lg:py-12"
      >
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.06, ease: [0.22, 0.61, 0.36, 1] }}
          className="max-w-3xl text-balance text-4xl font-extralight leading-[1.1] tracking-widest text-black sm:text-5xl lg:text-6xl xl:text-[4rem]"
        >
          QUANTUM
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 0.61, 0.36, 1] }}
          className="font-mono mt-4 max-w-[min(100%,42rem)] text-balance text-center sm:mt-5"
          aria-label="START SMALL BUILD BEYOND"
        >
          <span className="block text-[clamp(1.75rem,2.75vw+0.75rem,2.75rem)] font-extralight uppercase leading-[1.08] tracking-[-0.02em] text-black">
            START SMALL
          </span>
          <span className="mt-1 block text-[clamp(1.75rem,2.75vw+0.75rem,2.75rem)] font-medium uppercase leading-[1.08] tracking-[-0.02em] text-black sm:mt-1.5">
            BUILD BEYOND
          </span>
        </motion.div>

        <p className="mt-5 max-w-xl font-sans text-sm font-light leading-relaxed text-black/60 sm:mt-6 sm:text-base lg:text-lg">
          From 3 topics to unlimited AI-driven design. Quantum scales your
          support from free to Pro in one click.
        </p>
        <div className="mt-6 flex w-full max-w-xl flex-wrap items-center justify-center gap-3 sm:mt-8 sm:gap-4">
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <Link href="/dashboard" className={heroCtaClassName}>
              Dashboard
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            {hasLandingPublishedFaq && publishedFaqUrl ? (
              <Link
                href={publishedFaqUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={heroCtaClassName}
              >
                View published FAQs
              </Link>
            ) : (
              <Link href="/dashboard/faq/create" className={heroCtaClassName}>
                Create FAQ
              </Link>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
