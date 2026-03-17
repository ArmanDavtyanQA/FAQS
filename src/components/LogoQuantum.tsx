"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LogoQuantum() {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <motion.div
        initial={{ filter: "blur(1px)", opacity: 0.9 }}
        whileHover={{ filter: "blur(0px)", opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative h-12 w-12 rounded-3xl border border-white/40 bg-white/20 shadow-[0_10px_35px_rgba(15,23,42,0.26)] backdrop-blur-md"
      >
        {/* Glass hook of the question mark */}
        <svg
          viewBox="0 0 40 40"
          className="pointer-events-none absolute inset-0 h-full w-full text-black/35"
          aria-hidden="true"
        >
          <path
            d="M20 8c-4.3 0-7.5 2.7-7.5 6.6 0 .7.1 1.3.3 1.9.2.6.8.9 1.4.8 1-.2 1.4-1.2 1.2-2-0.1-.4-.2-.8-.2-1.2 0-2.2 1.7-3.7 4.7-3.7 2.6 0 4.3 1.4 4.3 3.5 0 1.5-.7 2.5-2.4 3.5-2 1.2-3.1 2.4-3.1 4.6v1c0 .6.4 1 1 1h.2c.6 0 1-.4 1-1V22c0-1.4.7-2.1 2.3-3 2-1.1 3.6-2.8 3.6-5.8C29.8 11 26.6 8 20 8Z"
            fill="url(#hook-fill)"
            stroke="rgba(148,163,184,0.45)"
            strokeWidth="0.6"
          />
          <defs>
            <linearGradient id="hook-fill" x1="10" y1="8" x2="30" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="rgba(255,255,255,0.75)" />
              <stop offset="0.5" stopColor="rgba(248,250,252,0.45)" />
              <stop offset="1" stopColor="rgba(226,232,240,0.2)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Glass sphere dot */}
        <div className="pointer-events-none absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-white/40 bg-white/60 shadow-[0_6px_18px_rgba(15,23,42,0.45)] backdrop-blur-md" />
      </motion.div>

      <span className="hidden text-xs font-light tracking-[0.35em] text-[#020617] sm:inline-block">
        QUANTUM
      </span>
    </Link>
  );
}

