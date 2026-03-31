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

/**
 * Pricing / plans — transparent canvas so global body gradient + grid show through.
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
          <h2 className="text-3xl font-extralight tracking-[0.2em] text-foreground sm:text-4xl">
            PLANS
          </h2>
          <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed tracking-wide text-foreground/55">
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
              className={`glass-feature-card group relative flex flex-col rounded-[2rem] p-7 transition-all duration-500 ${
                plan.emphasized
                  ? "ring-1 ring-slate-400/40 shadow-lg shadow-slate-900/10"
                  : ""
              }`}
            >
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-surface/35 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              <div className="relative z-10 flex flex-1 flex-col">
                <h3 className="text-[11px] font-bold tracking-[0.2em] text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-3xl font-extralight tracking-tight text-foreground">
                    {plan.price}
                  </span>
                  {plan.subtitle && (
                    <span className="text-xs font-light tracking-widest text-foreground/45">
                      {plan.subtitle}
                    </span>
                  )}
                </p>

                <ul className="mt-6 flex flex-1 flex-col gap-2.5 border-t border-foreground/[0.08] pt-6">
                  {plan.features.map((line) => (
                    <li
                      key={line}
                      className="text-[13px] font-light leading-snug text-foreground/55 transition-colors group-hover:text-foreground/75"
                    >
                      {line}
                    </li>
                  ))}
                </ul>

                <p className="mt-8 text-[10px] font-medium uppercase tracking-widest text-foreground/35">
                  {plan.cta}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute left-0 top-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-slate-400/[0.07] blur-[80px]" />
    </section>
  );
}
