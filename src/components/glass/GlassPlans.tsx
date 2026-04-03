"use client";

import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "$0",
    subtitle: "Limited services",
    features: [
      "Maximum 3 topics",
      "Up to 3 questions per topic",
      "No templates",
      "No Live preview",
      "No custom background or colors",
      "No custom domain",
      "No QR link to your FAQ",
      "No AI analysis of your page to suggest common questions",
    ],
    cta: "Start free",
    emphasized: false,
  },
  {
    name: "Friendly",
    price: "$5",
    subtitle: "per month",
    features: [
      "Maximum 6 topics",
      "Up to 10 questions per topic",
      "Basic templates (up to 3)",
      "Live preview",
      "QR link to your FAQ page",
      "Custom background (no custom styles or colors)",
      "No custom domain",
      "No AI analysis of your page",
    ],
    cta: "Choose Friendly",
    emphasized: false,
  },
  {
    name: "Advanced",
    price: "$10",
    subtitle: "per month",
    features: [
      "Maximum 10 topics",
      "Up to 25 questions",
      "AI-recommended templates",
      "500 AI queries for search & template recommendations",
      "QR link to your FAQ",
      "Custom domain",
      "Upload your own FAQ page background",
    ],
    cta: "Go Advanced",
    emphasized: true,
  },
  {
    name: "Pro",
    price: "$20",
    subtitle: "per month",
    features: [
      "20 topics & 35 questions",
      "Unlimited AI search & template recommendations",
      "QR link to your FAQ",
      "Custom domain",
      "Custom page design — fully tailor styles (Go Premium)",
    ],
    cta: "Go Pro",
    emphasized: false,
  },
];

const planCardBase =
  "group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white/95 p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-500";

/**
 * Pricing / plans — same refractive panel language as GlassHero (white/slate, soft indigo wash).
 */
export default function GlassPlans() {
  return (
    <section
      id="plans"
      className="relative scroll-mt-28 bg-transparent px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          className="mb-4"
        >
          <h2 className="text-3xl font-extralight tracking-[0.2em] text-slate-900 sm:text-4xl">
            PLANS
          </h2>
          <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed tracking-wide text-slate-600">
            Pick a tier that matches your topics, questions, and how you want
            your public FAQ to look. Every workspace gets a shareable FAQ page;
            higher tiers unlock preview, QR, domains, AI, and custom design.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan, i) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.65,
                delay: i * 0.06,
                ease: [0.22, 0.61, 0.36, 1],
              }}
              whileHover={{ y: -6, scale: 1.01 }}
              className={`${planCardBase} ${
                plan.emphasized
                  ? "ring-1 ring-slate-300/70 shadow-[0_24px_72px_rgba(15,23,42,0.12)]"
                  : ""
              }`}
            >
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
                aria-hidden
              >
                <div className="absolute -left-[18%] bottom-[-32%] h-[min(20rem,65vw)] w-[min(32rem,95%)] rounded-full bg-gradient-to-tr from-slate-400/10 via-indigo-500/8 to-transparent blur-[72px]" />
              </div>
              <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/50 via-transparent to-indigo-500/[0.04] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              <div className="relative z-10 flex flex-1 flex-col">
                <h3 className="text-[11px] font-bold tracking-[0.2em] text-slate-900">
                  {plan.name}
                </h3>
                <p className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-3xl font-extralight tracking-tight text-slate-900">
                    {plan.price}
                  </span>
                  {plan.subtitle && (
                    <span className="text-xs font-light tracking-widest text-slate-500">
                      {plan.subtitle}
                    </span>
                  )}
                </p>

                <ul className="mt-6 flex flex-1 flex-col gap-2.5 border-t border-slate-200/80 pt-6">
                  {plan.features.map((line) => (
                    <li
                      key={line}
                      className="text-[13px] font-light leading-snug text-slate-600 transition-colors group-hover:text-slate-800"
                    >
                      {line}
                    </li>
                  ))}
                </ul>

                <p className="mt-8 text-[10px] font-medium uppercase tracking-widest text-slate-400">
                  {plan.cta}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute left-0 top-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-tr from-slate-400/12 via-indigo-400/8 to-transparent blur-[80px]" />
    </section>
  );
}
