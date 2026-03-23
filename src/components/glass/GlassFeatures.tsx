"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Cpu, Globe } from "lucide-react";

const features = [
  {
    title: "SECURE CORE",
    desc: "Enterprise-grade encryption wrapped in a matte finish.",
    icon: <Shield size={20} strokeWidth={1} />,
  },
  {
    title: "QUANTUM SPEED",
    desc: "Next.js 16 optimized rendering for zero-latency glass.",
    icon: <Zap size={20} strokeWidth={1} />,
  },
  {
    title: "AI ADAPTIVE",
    desc: "Intelligent layout shifting based on user behavior.",
    icon: <Cpu size={20} strokeWidth={1} />,
  },
  {
    title: "GLOBAL EDGE",
    desc: "Deploy to 100+ edges with refractive clarity.",
    icon: <Globe size={20} strokeWidth={1} />,
  },
];

/**
 * Physical Glass — feature grid (source of truth)
 * Cards: bg-white/[0.01] + backdrop-blur-[30px] + directional bevel
 */
export default function GlassFeatures() {
  return (
    <section className="relative bg-[#FDFDFB] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-feature-card group relative rounded-[2rem] p-8 transition-all duration-500"
            >
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-black/[0.05] bg-black/[0.03] text-black/60 transition-colors group-hover:text-black">
                  {f.icon}
                </div>

                <h3 className="mb-3 text-[11px] font-bold tracking-[0.2em] text-black">
                  {f.title}
                </h3>

                <p className="text-sm font-light leading-relaxed text-black/50 transition-colors group-hover:text-black/80">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute left-0 top-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-black/[0.02] blur-[80px]" />
    </section>
  );
}
