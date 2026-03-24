"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GlassLogo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="/"
      className="group relative flex h-10 select-none items-center gap-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex h-8 w-8 items-center justify-center rounded-xl">
        <div className="absolute inset-0 rounded-xl border border-white/40 bg-white/[0.03] shadow-sm backdrop-blur-md" />

        <motion.span
          initial={{ filter: "blur(3px)", opacity: 0.15 }}
          animate={
            isHovered
              ? { filter: "blur(0px)", opacity: 0.4 }
              : { filter: "blur(2.5px)", opacity: 0.15 }
          }
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 flex select-none items-center justify-center text-3xl font-extrabold leading-none text-black"
          aria-hidden
        >
          ?
        </motion.span>

        <motion.div
          animate={isHovered ? { opacity: 0.6 } : { opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="pointer-events-none absolute inset-0 rounded-xl bg-[conic-gradient(at_top_left,rgba(0,217,255,0.08)_0deg,transparent_60deg,rgba(255,0,0,0.08)_120deg,transparent_180deg)]"
        />
      </div>

      <div className="flex flex-col items-start leading-none">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-black">
          Quantum
        </span>
      </div>
    </Link>
  );
}
