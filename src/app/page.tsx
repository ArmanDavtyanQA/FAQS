import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-24 lg:gap-32">
      <section className="grid gap-16 lg:grid-cols-2 lg:items-end lg:gap-20">
        <div className="space-y-8">
          <p className="label-caps">FAQ pages & embed</p>
          <h1 className="max-w-xl text-balance text-4xl font-normal leading-[1.15] tracking-tight text-[#0a0a0a] sm:text-5xl lg:text-[3.25rem]">
            One link.
            <br />
            One embed.
            <br />
            Your FAQs.
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-[#6b6b6b]">
            Publish a clean page and paste a snippet on your site. Update
            answers anytime without developers.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/auth?redirectTo=/dashboard"
              className="btn-shadow-smooth btn-solid-edge interactive-smooth inline-flex h-11 items-center justify-center rounded-xl bg-[#0a0a0a] px-8 text-[11px] font-medium uppercase tracking-[0.15em] text-white"
            >
              Get started
            </Link>
            <a
              href="#how-it-works"
              className="btn-shadow-smooth btn-ghost-edge interactive-smooth inline-flex h-11 items-center justify-center rounded-xl bg-white px-8 text-[11px] font-medium uppercase tracking-[0.15em] text-[#0a0a0a]"
            >
              How it works
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-[#e8e6e3] bg-white p-8 shadow-xl shadow-black/5">
          <p className="label-caps mb-6">Preview</p>
          <p className="text-sm font-medium text-[#0a0a0a]">
            Frequently asked questions
          </p>
          <ul className="mt-6 space-y-0 divide-y divide-[#e8e6e3] text-sm text-[#6b6b6b]">
            <li className="py-3">Return policy</li>
            <li className="py-3">Order tracking</li>
            <li className="py-3">Payment methods</li>
          </ul>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-28 border-t border-[#e8e6e3] pt-16">
        <h2 className="label-caps mb-12">How it works</h2>
        <ol className="grid gap-12 sm:grid-cols-3 sm:gap-8">
          {[
            {
              n: "01",
              t: "Create",
              d: "Add questions and answers in the dashboard.",
            },
            {
              n: "02",
              t: "Publish",
              d: "Share your link or keep drafts private.",
            },
            {
              n: "03",
              t: "Embed",
              d: "Paste the snippet on your website.",
            },
          ].map((item) => (
            <li
              key={item.n}
              className="rounded-xl border border-[#e8e6e3] bg-white p-6 shadow-md shadow-black/5"
            >
              <span className="label-caps text-[#0a0a0a]">
                {item.n}
              </span>
              <p className="mt-3 text-sm font-medium text-[#0a0a0a]">
                {item.t}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">
                {item.d}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="border-t border-[#e8e6e3] pt-10">
        <p className="label-caps">
          © {new Date().getFullYear()} FAQ Studio
        </p>
      </footer>
    </main>
  );
}
