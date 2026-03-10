export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        {/* Nav */}
        <header className="flex items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900">
              FAQ
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                FAQ Studio
              </span>
              <span className="text-xs text-zinc-400">
                Beautiful FAQs in minutes
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
            <a href="#how-it-works" className="hover:text-white">
              How it works
            </a>
            <a href="#templates" className="hover:text-white">
              Templates
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
            <a href="#faq" className="hover:text-white">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden rounded-full border border-zinc-700 px-4 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-500 hover:text-white md:inline-flex">
              Sign in
            </button>
            <button className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-zinc-900 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] shadow-zinc-950/60 transition hover:bg-zinc-100">
              Start free trial
            </button>
          </div>
        </header>

        <main className="mt-10 flex flex-1 flex-col gap-16 lg:mt-16">
          {/* Hero */}
          <section className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700/70 bg-zinc-900/60 px-2.5 py-1 text-xs text-zinc-300 shadow-sm shadow-black/40">
                <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-green-400">
                  New
                </span>
                <span className="hidden sm:inline">
                  Launch your FAQ page & widget in under 5 minutes
                </span>
                <span className="sm:hidden">
                  Launch in under 5 minutes
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Turn messy questions into a
                  <span className="bg-gradient-to-r from-sky-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                    {" "}
                    beautiful FAQ experience
                  </span>
                  .
                </h1>
                <p className="max-w-xl text-balance text-sm text-zinc-300 sm:text-base">
                  FAQ Studio is a FAQ generator for modern SaaS & online
                  businesses. Create a branded FAQ page with a unique URL and
                  drop-in widget code for your existing site — no developers
                  required.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 shadow-[0_18px_45px_rgba(0,0,0,0.65)] transition hover:bg-zinc-100">
                  Get started free
                </button>
                <button className="inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/40 px-5 py-2 text-sm font-medium text-zinc-100 hover:border-zinc-500">
                  See live demo
                </button>
                <p className="ml-1 text-xs text-zinc-400">
                  No credit card. 14‑day free trial.
                </p>
              </div>

              <dl className="grid max-w-lg grid-cols-2 gap-4 text-xs text-zinc-300 sm:text-sm">
                <div className="space-y-1">
                  <dt className="font-medium text-zinc-100">
                    Hosted FAQ pages
                  </dt>
                  <dd>Each business gets a fast, SEO‑friendly FAQ URL.</dd>
                </div>
                <div className="space-y-1">
                  <dt className="font-medium text-zinc-100">Embed widget</dt>
                  <dd>Copy‑paste one line of code into your site.</dd>
                </div>
                <div className="space-y-1">
                  <dt className="font-medium text-zinc-100">Theme templates</dt>
                  <dd>Pick from modern layouts and color systems.</dd>
                </div>
                <div className="space-y-1">
                  <dt className="font-medium text-zinc-100">Team friendly</dt>
                  <dd>Let support & marketing update FAQs safely.</dd>
                </div>
              </dl>
            </div>

            {/* Hero preview card */}
            <div className="relative">
              <div className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(74,222,128,0.10),transparent_60%)] opacity-80 blur-3xl" />

              <div className="rounded-3xl border border-zinc-700/80 bg-gradient-to-b from-zinc-900/95 to-zinc-950/95 p-5 shadow-[0_22px_60px_rgba(0,0,0,0.85)]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-zinc-200">
                      help.acme.co
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Hosted FAQ page generated with FAQ Studio
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                    Live
                  </span>
                </div>

                <div className="rounded-2xl border border-zinc-700/80 bg-zinc-950/90 p-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-semibold text-zinc-50">
                        Frequently asked questions
                      </h2>
                      <p className="text-xs text-zinc-400">
                        Real‑time, searchable, and always on‑brand.
                      </p>
                    </div>
                    <button className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-zinc-200 ring-1 ring-white/5">
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
                        className="group rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-200 transition hover:border-sky-400/60 hover:bg-zinc-900"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium">{q}</p>
                          <span className="text-[10px] text-zinc-500 group-hover:text-sky-300">
                            View
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-[11px] text-zinc-400">
                          Lorem ipsum placeholder copy that hints at your clear,
                          helpful answer. Keep it short and skimmable.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 rounded-2xl border border-dashed border-emerald-400/30 bg-emerald-400/5 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-medium text-emerald-200">
                      Embed widget on your site
                    </p>
                    <button className="rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-medium text-emerald-200 ring-1 ring-emerald-400/40">
                      Copy code
                    </button>
                  </div>
                  <pre className="overflow-x-auto rounded-xl bg-black/70 p-3 text-[10px] text-emerald-200">
                    {`<script src="https://faq.studio/widget.js" data-faq-id="acme"></script>`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* How it works / Features */}
          <section
            id="how-it-works"
            className="space-y-8 rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                  Built for fast‑moving teams
                </h2>
                <p className="mt-2 max-w-xl text-sm text-zinc-300">
                  Everything you need to launch, manage, and evolve FAQs across
                  all your products — without asking engineering for changes.
                </p>
              </div>
              <p className="text-xs text-zinc-400">
                From first draft to live widget in three steps.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  step: "1",
                  label: "Create your FAQ space",
                  title: "Describe your business",
                  body: "Name your FAQ, add categories, and import existing questions or start from a blank canvas.",
                },
                {
                  step: "2",
                  label: "Design the experience",
                  title: "Pick a template",
                  body: "Choose from modern FAQ layouts, customize colors, typography, and spacing to match your brand.",
                },
                {
                  step: "3",
                  label: "Publish everywhere",
                  title: "Share link & widget",
                  body: "Get a unique public URL plus a lightweight widget snippet you can drop into any website.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="group flex flex-col rounded-2xl border border-zinc-800/90 bg-zinc-950/70 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.70)] transition hover:border-sky-500/60 hover:bg-zinc-950"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-zinc-200 ring-1 ring-zinc-700 group-hover:ring-sky-400/60">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                      {item.label}
                    </span>
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-zinc-50">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-300">{item.body}</p>
                </div>
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
                <p className="mt-2 max-w-xl text-sm text-zinc-300">
                  Select a starting point and fine‑tune spacing, corner
                  radiuses, typography and accent colors. Swap templates any
                  time without breaking links.
                </p>
              </div>
              <p className="text-xs text-zinc-400">
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
                  className="group flex flex-col justify-between rounded-3xl border border-zinc-800/90 bg-zinc-950/80 p-4"
                >
                  <div className="mb-3 flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-100">
                      {tpl.name}
                    </span>
                    <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400">
                      {tpl.tag}
                    </span>
                  </div>
                  <div className="mb-4 h-32 rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-2">
                    <div
                      className={`${tpl.accent} mb-2 h-8 w-2/3 rounded-xl`}
                    />
                    <div className="space-y-1.5">
                      <div className="h-3 w-full rounded-lg bg-zinc-800" />
                      <div className="h-3 w-4/5 rounded-lg bg-zinc-800/90" />
                      <div className="h-3 w-3/5 rounded-lg bg-zinc-800/80" />
                    </div>
                  </div>
                  <button className="mt-auto inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-950/60 px-3 py-1.5 text-[11px] font-medium text-zinc-100 group-hover:border-sky-400/70 group-hover:text-sky-200">
                    Preview template
                  </button>
                </article>
              ))}
            </div>
          </section>

          {/* Pricing */}
          <section
            id="pricing"
            className="space-y-6 rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                  Simple, predictable pricing
                </h2>
                <p className="mt-2 max-w-xl text-sm text-zinc-300">
                  Start free, then upgrade only when you are ready to publish
                  your FAQ page and widget to production.
                </p>
              </div>
              <p className="text-xs text-zinc-400">
                Change plans or cancel anytime. No hidden fees.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <div className="flex flex-col justify-between rounded-3xl border border-sky-500/70 bg-gradient-to-b from-sky-500/15 via-sky-500/5 to-zinc-950 p-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                    Recommended for growing teams
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-semibold tracking-tight">
                      $19
                    </p>
                    <span className="pb-1 text-xs text-zinc-400">
                      per month, per brand
                    </span>
                  </div>
                  <ul className="mt-2 space-y-2 text-sm text-zinc-100">
                    <li>Unlimited FAQ questions & categories</li>
                    <li>Hosted FAQ page with custom subdomain</li>
                    <li>Embed widget for any website or tech stack</li>
                    <li>Theme templates with advanced customization</li>
                    <li>Analytics on views, searches & drop‑offs</li>
                  </ul>
                </div>
                <button className="mt-6 inline-flex items-center justify-center rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-[0_18px_40px_rgba(56,189,248,0.65)] transition hover:bg-sky-300">
                  Start 14‑day trial
                </button>
              </div>

              <div className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5 text-sm text-zinc-300">
                <h3 className="text-sm font-semibold text-zinc-100">
                  Early‑stage or side project?
                </h3>
                <p className="text-xs text-zinc-400">
                  We offer discounts for early‑stage teams, non‑profits and
                  open‑source products. Reach out and we will find a plan that
                  fits your stage.
                </p>
                <button className="mt-2 inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-xs font-medium text-zinc-100 hover:border-zinc-500">
                  Talk to sales
                </button>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                Frequently asked questions
              </h2>
              <p className="mt-2 max-w-xl text-sm text-zinc-300">
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
              ].map((item) => (
                <article
                  key={item.q}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4"
                >
                  <h3 className="text-sm font-medium text-zinc-100">
                    {item.q}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-300">{item.a}</p>
                </article>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-10 border-t border-zinc-800/80 pt-4 text-xs text-zinc-500 sm:mt-14">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} FAQ Studio. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#" className="hover:text-zinc-300">
                Privacy
              </a>
              <a href="#" className="hover:text-zinc-300">
                Terms
              </a>
              <a href="#" className="hover:text-zinc-300">
                Status
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
