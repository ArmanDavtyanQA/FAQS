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

const heroCtaPrimary =
  "btn-ui btn-ui-primary inline-flex h-12 rounded-xl px-8 text-xs";

const heroCtaSecondary =
  "btn-ui btn-ui-secondary inline-flex h-12 rounded-xl px-8 text-xs";

/**
 * High-contrast hero: light card, dark type, minimal cool accent (readability first).
 */
export default function GlassHero() {
  return (
    <section className="relative mt-0 flex min-h-[calc(100dvh-7.5rem)] flex-col justify-center px-4 py-8 sm:px-6 sm:py-10 lg:min-h-[calc(100dvh-8.5rem)] lg:px-10 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:rounded-3xl"
      >
        <div className="relative z-10 px-5 pb-12 pt-8 sm:px-10 sm:pb-14 sm:pt-10">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.06, ease: [0.22, 0.61, 0.36, 1] }}
              className="w-full text-balance text-center text-4xl font-light leading-[1.1] tracking-[0.12em] text-slate-900 sm:text-5xl lg:text-6xl xl:text-[3.75rem]"
            >
              QUANTUM
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
              className="font-mono mt-5 flex w-full max-w-[min(100%,42rem)] flex-col items-center text-center sm:mt-6"
              aria-label="START SMALL BUILD BEYOND"
            >
              <span className="block w-full text-center text-[clamp(1.5rem,2.2vw+0.75rem,2.4rem)] font-light uppercase leading-[1.1] tracking-[-0.02em] text-slate-800">
                START SMALL
              </span>
              <span className="mt-1 block w-full text-center text-[clamp(1.5rem,2.2vw+0.75rem,2.4rem)] font-semibold uppercase leading-[1.1] tracking-[-0.02em] text-slate-900 sm:mt-1.5">
                BUILD BEYOND
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.14, ease: [0.22, 0.61, 0.36, 1] }}
              className="mx-auto mt-6 max-w-xl text-pretty text-center text-base font-normal leading-relaxed text-slate-600 sm:mt-7 sm:text-lg"
            >
              From 3 topics to unlimited AI-driven design. Quantum scales your
              support from free to Pro in one click.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
              className="mt-8 flex w-full flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4"
            >
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <Link href="/dashboard/faq/create" className={heroCtaPrimary}>
                  Create FAQ
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <Link href="/studio" className={heroCtaSecondary}>
                  Studio
                </Link>
              </motion.div>
              {hasLandingPublishedFaq && publishedFaqUrl ? (
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <Link
                    href={publishedFaqUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={heroCtaSecondary}
                  >
                    View published FAQs
                  </Link>
                </motion.div>
              ) : null}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
