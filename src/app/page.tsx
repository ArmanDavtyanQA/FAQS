export default function Home() {
  return (
    <>
      <main className="mt-6 flex flex-1 flex-col gap-16 lg:mt-10">
          {/* Hero */}
          <section className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div className="space-y-7">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-200 shadow-[0_0_0_1px_rgba(15,23,42,0.6)] backdrop-blur">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.21em] text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  New
                </span>
                <span className="hidden sm:inline">
                  Launch a colorful FAQ page & widget in under 5 minutes
                </span>
                <span className="sm:hidden">Launch in under 5 minutes</span>
              </div>

              <div className="space-y-5">
                <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem]">
                  Give every product a
                  <span className="bg-gradient-to-r from-sky-300 via-fuchsia-300 to-emerald-300 bg-clip-text text-transparent">
                    {" "}
                    living FAQ hub
                  </span>
                  .
                </h1>
                <p className="max-w-xl text-balance text-sm text-slate-200/90 sm:text-base">
                  FAQ Studio is a colorful, AI‑assisted FAQ generator for modern
                  SaaS and online businesses. Ship a beautiful FAQ page with its
                  own URL, plus an on‑brand widget that drops into any website.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-400 via-fuchsia-400 to-emerald-400 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_22px_55px_rgba(56,189,248,0.8)] transition hover:brightness-110">
                  Get started free
                </button>
                <button className="inline-flex items-center justify-center rounded-full border border-slate-500/80 bg-slate-900/70 px-5 py-2 text-sm font-medium text-slate-50 hover:border-slate-300">
                  Watch 2‑minute demo
                </button>
                <p className="ml-1 text-xs text-slate-300/90">
                  No credit card. 14‑day free trial. Cancel anytime.
                </p>
              </div>

              <dl className="grid max-w-xl grid-cols-2 gap-4 text-xs text-slate-200/90 sm:text-sm">
                <div className="space-y-1">
                  <dt className="flex items-center gap-2 font-medium text-slate-50">
                    <span className="h-1.5 w-6 rounded-full bg-sky-400/80" />
                    Hosted FAQ pages
                  </dt>
                  <dd>Every business gets a fast, SEO‑ready FAQ URL.</dd>
                </div>
                <div className="space-y-1">
                  <dt className="flex items-center gap-2 font-medium text-slate-50">
                    <span className="h-1.5 w-6 rounded-full bg-emerald-400/80" />
                    Widget embed
                  </dt>
                  <dd>Copy‑paste one colorful widget into any site.</dd>
                </div>
                <div className="space-y-1">
                  <dt className="flex items-center gap-2 font-medium text-slate-50">
                    <span className="h-1.5 w-6 rounded-full bg-fuchsia-400/80" />
                    Theme templates
                  </dt>
                  <dd>Pick vibrant layouts and adjust to your brand.</dd>
                </div>
                <div className="space-y-1">
                  <dt className="flex items-center gap-2 font-medium text-slate-50">
                    <span className="h-1.5 w-6 rounded-full bg-amber-300/80" />
                    AI content assist
                  </dt>
                  <dd>Draft or improve FAQ answers with one click.</dd>
                </div>
              </dl>
            </div>

            {/* Hero preview card */}
            <div className="relative">
              <div className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.26),transparent_55%),radial-gradient(circle_at_bottom,_rgba(244,114,182,0.18),transparent_60%)] opacity-90 blur-3xl" />

              <div className="rounded-3xl border border-white/6 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-950/98 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.95)]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-slate-100">
                      help.acme.co
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Hosted FAQ page generated with FAQ Studio
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    Live
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-700/80 bg-slate-950/90 p-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-50">
                        Frequently asked questions
                      </h2>
                      <p className="text-xs text-slate-400">
                        Real‑time, searchable, and always on‑brand.
                      </p>
                    </div>
                    <button className="rounded-full bg-gradient-to-r from-sky-500/30 via-fuchsia-500/30 to-emerald-400/30 px-3 py-1 text-[11px] font-medium text-slate-50 ring-1 ring-white/10">
                      Open widget
                    </button>
                  </div>

                  <div className="space-y-2">
                    {[
                      "How do I install the FAQ widget?",
                      "Can I match my brand colors?",
                      "Does it work with any website builder?",
                    ].map((q) => (
                      <div
                        key={q}
                        className="group rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 transition hover:border-sky-400/70 hover:bg-slate-900"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium">{q}</p>
                          <span className="text-[10px] text-slate-500 group-hover:text-sky-300">
                            View
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-[11px] text-slate-400">
                          Lorem ipsum placeholder copy that hints at your clear,
                          helpful answer. Keep it short and skimmable.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 rounded-2xl border border-dashed border-emerald-400/40 bg-gradient-to-r from-emerald-400/10 via-sky-400/10 to-fuchsia-400/10 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-medium text-emerald-100">
                      Embed widget on your site
                    </p>
                    <button className="rounded-full bg-emerald-400/20 px-3 py-1 text-[10px] font-medium text-emerald-950 ring-1 ring-emerald-300 shadow-[0_10px_28px_rgba(16,185,129,0.55)]">
                      Copy code
                    </button>
                  </div>
                  <pre className="overflow-x-auto rounded-xl bg-black/80 p-3 text-[10px] text-emerald-200">
                    {`<script src="https://faq.studio/widget.js" data-faq-id="acme"></script>`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Social proof */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs font-medium uppercase tracking-[0.21em] text-slate-400">
                TRUSTED BY TEAMS SHIPPING COLORFUL SUPPORT EXPERIENCES
              </p>
              <p className="text-xs text-slate-400">
                3k+ FAQ pages generated and counting.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-[11px] text-slate-300/90">
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1">
                acme.cloud
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1">
                brightpay.io
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1">
                loopcart.app
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1">
                northdesk.dev
              </span>
            </div>
          </section>

          {/* How it works / Journey */}
          <section
            id="how-it-works"
            className="space-y-8 rounded-3xl border border-slate-800/80 bg-slate-950/90 p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                  From messy questions to a colorful FAQ hub
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-200/90">
                  Everything you need to launch, manage, and evolve FAQs across
                  all your products — in one vibrant workspace, no engineering
                  tickets required.
                </p>
              </div>
              <p className="text-xs text-slate-400">
                From first draft to live widget in three clear steps.
          </p>
        </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  step: "1",
                  label: "Create your FAQ space",
                  title: "Describe your business",
                  body: "Name your FAQ, choose categories, invite your team and import existing questions in bulk.",
                },
                {
                  step: "2",
                  label: "Design the experience",
                  title: "Pick a template",
                  body: "Choose from colorful FAQ layouts, then edit colors, typography and spacing to mirror your product UI.",
                },
                {
                  step: "3",
                  label: "Publish everywhere",
                  title: "Share link & widget",
                  body: "Get a unique public URL plus a lightweight widget snippet that works with any website or app.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="group flex flex-col rounded-2xl border border-slate-800/90 bg-slate-950/80 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.80)] transition hover:border-sky-500/70 hover:bg-slate-950"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-zinc-200 ring-1 ring-zinc-700 group-hover:ring-sky-400/60">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                      {item.label}
                    </span>
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-slate-50">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-200/90">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Feature grid */}
          <section
            id="features"
            className="space-y-6 rounded-3xl border border-slate-800/80 bg-slate-950/90 p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                  Colorful features for serious teams
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-200/90">
                  Everything is built so support, success, and marketing can
                  keep FAQs fresh without chasing engineering.
                </p>
              </div>
              <p className="text-xs text-slate-400">
                Turn scattered docs into a single FAQ source of truth.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "AI suggestions",
                  title: "Let AI do the first draft",
                  body: "Paste raw notes and let our assistant propose questions and clear, friendly answers.",
                  accent: "from-sky-400/60 to-cyan-300/50",
                },
                {
                  label: "Search & insights",
                  title: "See what customers are asking",
                  body: "Track views, searches and empty search results to know which answers to improve next.",
                  accent: "from-emerald-400/70 to-lime-300/60",
                },
                {
                  label: "Multi-brand",
                  title: "One workspace, many products",
                  body: "Create separated FAQ spaces per brand or product with their own links and widgets.",
                  accent: "from-fuchsia-400/70 to-rose-300/60",
                },
                {
                  label: "Instant updates",
                  title: "Ship edits in seconds",
                  body: "Reorder, hide or update FAQs without redeploying your website or waiting on devs.",
                  accent: "from-amber-300/80 to-orange-400/70",
                },
                {
                  label: "Custom themes",
                  title: "Match your design system",
                  body: "Fine‑tune radius, shadow, font and color tokens so your FAQ feels truly native.",
                  accent: "from-indigo-400/70 to-sky-400/70",
                },
                {
                  label: "Collaboration",
                  title: "Safe team permissions",
                  body: "Let teammates propose changes, then approve and publish with a clear activity history.",
                  accent: "from-slate-300/90 to-emerald-200/80",
                },
              ].map((feature) => (
                <article
                  key={feature.title}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-4"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                      {feature.label}
                    </span>
                    <span
                      className={`h-1.5 w-14 rounded-full bg-gradient-to-r ${feature.accent}`}
                    />
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-slate-50">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-200/90">{feature.body}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Templates */}
          <section id="templates" className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                  Templates for every brand
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-200/90">
                  Select a starting point and fine‑tune spacing, corner
                  radiuses, typography and accent colors. Swap templates any
                  time without breaking links.
                </p>
              </div>
              <p className="text-xs text-slate-400">
                All templates are mobile‑first and accessibility‑friendly.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  name: "Gradient Glow",
                  tag: "Best for SaaS",
                  accent:
                    "bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-300",
                },
                {
                  name: "Minimal Lines",
                  tag: "Best for docs",
                  accent:
                    "bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-50",
                },
                {
                  name: "Card Stack",
                  tag: "Best for e‑commerce",
                  accent:
                    "bg-gradient-to-br from-amber-300 via-orange-300 to-rose-300",
                },
              ].map((tpl) => (
                <article
                  key={tpl.name}
                  className="group flex flex-col justify-between rounded-3xl border border-slate-800/90 bg-slate-950/80 p-4"
                >
                  <div className="mb-3 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-100">
                      {tpl.name}
                    </span>
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400">
                      {tpl.tag}
                    </span>
                  </div>
                  <div className="mb-4 h-32 rounded-2xl border border-slate-800/80 bg-slate-900/80 p-2">
                    <div
                      className={`${tpl.accent} mb-2 h-8 w-2/3 rounded-xl`}
                    />
                    <div className="space-y-1.5">
                      <div className="h-3 w-full rounded-lg bg-zinc-800" />
                      <div className="h-3 w-4/5 rounded-lg bg-zinc-800/90" />
                      <div className="h-3 w-3/5 rounded-lg bg-zinc-800/80" />
                    </div>
                  </div>
                  <button className="mt-auto inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1.5 text-[11px] font-medium text-slate-100 group-hover:border-sky-400/70 group-hover:text-sky-200">
                    Preview template
                  </button>
                </article>
              ))}
            </div>
          </section>

          {/* Pricing */}
          <section
            id="pricing"
            className="space-y-6 rounded-3xl border border-slate-800/80 bg-slate-950/90 p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                  Simple, predictable pricing
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-200/90">
                  Start free, then upgrade only when you are ready to publish
                  your FAQ page and widget to production.
                </p>
              </div>
              <p className="text-xs text-slate-400">
                Change plans or cancel anytime. No hidden fees.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <div className="flex flex-col justify-between rounded-3xl border border-sky-500/70 bg-gradient-to-b from-sky-500/20 via-fuchsia-500/15 to-slate-950 p-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                    Recommended for growing teams
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-semibold tracking-tight">
                      $19
                    </p>
                    <span className="pb-1 text-xs text-slate-100/80">
                      per month, per brand
                    </span>
                  </div>
                  <ul className="mt-2 space-y-2 text-sm text-slate-50">
                    <li>Unlimited FAQ questions & categories</li>
                    <li>Hosted FAQ page with custom subdomain</li>
                    <li>Embed widget for any website or tech stack</li>
                    <li>Theme templates with advanced customization</li>
                    <li>Analytics on views, searches & drop‑offs</li>
                  </ul>
                </div>
                <button className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-400 via-fuchsia-400 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_22px_50px_rgba(56,189,248,0.85)] transition hover:brightness-110">
                  Start 14‑day trial
                </button>
              </div>

              <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-5 text-sm text-slate-200/90">
                <h3 className="text-sm font-semibold text-slate-50">
                  Early‑stage or side project?
                </h3>
                <p className="text-xs text-slate-400">
                  We offer discounts for early‑stage teams, non‑profits and
                  open‑source products. Reach out and we will find a plan that
                  fits your stage.
                </p>
                <button className="mt-2 inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-medium text-slate-100 hover:border-slate-400">
                  Talk to sales
                </button>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                  Teams are shipping calmer support
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-200/90">
                  See how other SaaS teams use FAQ Studio to keep customers
                  informed — and inboxes quiet.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  quote:
                    "We shipped a fully themed FAQ page and widget in an afternoon. Our support queue dropped 23% in the first week.",
                  name: "Marta, Head of Support",
                  company: "brightpay.io",
                },
                {
                  quote:
                    "Marketing can finally update FAQs without tapping engineering. The templates make everything look on‑brand by default.",
                  name: "Jon, Product Marketing",
                  company: "northdesk.dev",
                },
                {
                  quote:
                    "The analytics around searches and empty results showed us exactly which answers to improve. Huge impact for a tiny effort.",
                  name: "Priya, Customer Success",
                  company: "loopcart.app",
                },
              ].map((t) => (
                <article
                  key={t.company}
                  className="rounded-2xl border border-slate-800 bg-slate-950/85 p-4 text-xs text-slate-200/90"
                >
                  <p className="mb-4">
                    “{t.quote}”
                  </p>
                  <p className="font-medium text-slate-100">{t.name}</p>
                  <p className="text-[11px] text-slate-400">{t.company}</p>
                </article>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                Frequently asked questions
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-200/90">
                Everything you need to know about using FAQ Studio as your FAQ
                generator.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  q: "Can every business have its own FAQ link?",
                  a: "Yes. Each business gets a dedicated FAQ space with a unique, SEO‑friendly URL that you can share in emails, chat or your help center.",
                },
                {
                  q: "How do I embed the widget into my website?",
                  a: "Copy the one‑line script snippet we provide and paste it into your site or tag manager. It works with any modern website builder or framework.",
                },
                {
                  q: "Can I customize the FAQ templates?",
                  a: "You can choose from multiple starter templates and fine‑tune colors, fonts, spacing and card styles so the FAQ matches your brand perfectly.",
                },
                {
                  q: "Do I need a developer to maintain FAQs?",
                  a: "No. Anyone on your team with access can reorder questions, update answers, and publish changes instantly — without touching any code.",
                },
                {
                  q: "Does FAQ Studio work with my stack?",
                  a: "If your website can load a small JavaScript snippet, the widget will work. We also support direct links if you prefer not to embed.",
                },
                {
                  q: "What happens when my trial ends?",
                  a: "Your FAQ stays live, but editing and analytics are paused. Choose a plan any time to unlock full access again.",
                },
              ].map((item) => (
                <article
                  key={item.q}
                  className="rounded-2xl border border-slate-800 bg-slate-950/85 p-4"
                >
                  <h3 className="text-sm font-medium text-slate-100">
                    {item.q}
                  </h3>
                  <p className="mt-2 text-xs text-slate-200/90">{item.a}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Product updates / changelog teaser */}
          <section
            id="updates"
            className="space-y-4 rounded-3xl border border-slate-800/80 bg-slate-950/90 p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                  Building fast, shipping often
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-200/90">
                  We ship improvements every week based on what our customers
                  ask for most.
                </p>
              </div>
              <button className="rounded-full border border-slate-600 bg-slate-950 px-4 py-2 text-xs font-medium text-slate-100 hover:border-slate-300">
                View full changelog
              </button>
            </div>

            <div className="grid gap-3 text-xs text-slate-200/90 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
              <div className="space-y-3">
                <div className="rounded-2xl border border-sky-500/50 bg-sky-500/15 p-3">
                  <p className="text-[11px] font-medium uppercase tracking-[0.21em] text-sky-200">
                    APR 2026
                  </p>
                  <p className="mt-1 font-medium text-slate-50">
                    New colorful templates & AI answer suggestions
                  </p>
                  <p className="mt-1 text-xs text-slate-100/90">
                    Launched three new FAQ layouts and an AI‑powered answer
                    assistant that helps you write and refine answers in‑place.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3">
                  <p className="text-[11px] font-medium uppercase tracking-[0.21em] text-slate-400">
                    MAR 2026
                  </p>
                  <p className="mt-1 font-medium text-slate-50">
                    Search analytics & empty‑result alerts
                  </p>
                  <p className="mt-1 text-xs text-slate-200/90">
                    Understand which topics customers search for most and where
                    your FAQ is missing answers.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/10 p-3">
                  <p className="text-[11px] font-medium uppercase tracking-[0.21em] text-emerald-200">
                    Coming soon
                  </p>
                  <p className="mt-1 font-medium text-slate-50">
                    Localization & multi‑language FAQs
                  </p>
                  <p className="mt-1 text-xs text-slate-100/90">
                    Manage multiple languages for the same FAQ and let your
                    visitors switch with a simple toggle.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-10 border-t border-slate-800/80 pt-4 text-xs text-slate-400 sm:mt-14">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} FAQ Studio. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#" className="hover:text-slate-200">
                Privacy
              </a>
              <a href="#" className="hover:text-slate-200">
                Terms
              </a>
              <a href="#" className="hover:text-slate-200">
                Status
          </a>
        </div>
          </div>
        </footer>
    </>
  );
}
