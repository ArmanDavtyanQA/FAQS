import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerAnon } from "@/lib/supabase/server";
import { dbListPublishedByUserId } from "@/lib/faq/supabase-faq";
import FAQAccordion from "@/components/faq/FAQAccordion";
import PublicFaqDashboardLink from "@/components/faq/PublicFaqDashboardLink";
import ContactForm from "@/components/ContactForm";

/** Label caps — charcoal for comfortable contrast on cream */
const faqBrowseLabelClass =
  "mb-5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-[#4B5563]";

type Props = { params: Promise<{ userId: string }> };

export default async function PublicFaqPage({ params }: Props) {
  const { userId } = await params;
  if (!userId || userId.length < 10) notFound();

  let faqs: Awaited<ReturnType<typeof dbListPublishedByUserId>> = [];
  try {
    const supabase = createSupabaseServerAnon();
    faqs = await dbListPublishedByUserId(supabase, userId);
  } catch {
    faqs = [];
  }

  return (
    <div className="min-h-screen bg-[#FDFCF6] text-[#1F1F1F]">
      {/* FAQ hero — low-glare ivory + soft top veil */}
      <section
        className="relative w-full overflow-hidden bg-[#FDFCF6] text-[#1F1F1F]"
        aria-label="FAQ"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.025)_0%,transparent_72%)]"
          aria-hidden
        />
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-amber-200/22"
          viewBox="0 0 1200 560"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <path
            d="M-40 380 C180 260 320 460 520 340 S880 180 1240 260"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeOpacity="0.35"
            strokeDasharray="5 12"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M-20 120 C280 40 480 200 720 100 S1040 40 1220 180"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.22"
            strokeDasharray="4 10"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M100 520 C340 440 560 580 900 480 S1120 400 1280 500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.18"
            strokeDasharray="6 14"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="relative z-10 mx-auto flex min-h-[min(42vh,420px)] max-w-3xl flex-col items-center justify-center px-5 py-16 text-center sm:min-h-[min(48vh,480px)] sm:px-8 sm:py-20 lg:min-h-[min(52vh,560px)] lg:py-28">
          <h1 className="text-balance font-sans text-4xl font-bold leading-[1.08] tracking-tight text-[#1F1F1F] sm:text-5xl lg:text-6xl">
            <span className="block">Frequently asked</span>
            <span className="mt-2 block bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-700 bg-clip-text text-transparent sm:mt-3">
              questions
            </span>
          </h1>
        </div>
      </section>

      <main className="mx-auto max-w-2xl px-5 py-12 sm:py-16 lg:max-w-3xl lg:px-8 lg:py-20">
        <section className="rounded-2xl border border-t-white/70 border-l-white/70 border-b-black/[0.08] border-r-black/[0.08] bg-white/40 px-5 py-8 shadow-[0_40px_100px_rgba(0,0,0,0.04)] backdrop-blur-xl sm:rounded-3xl sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="flex items-start justify-between gap-x-4 sm:gap-x-6">
            <div className="min-w-0 flex-1">
              <p className={faqBrowseLabelClass}>Browse answers</p>
              <h2 className="text-4xl font-normal tracking-tight text-[#0A0A0A] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
                Questions
              </h2>
            </div>
            <PublicFaqDashboardLink ownerUserId={userId} />
          </div>

          {faqs.length === 0 ? (
            <div className="mt-10 rounded-xl border border-t-white/60 border-l-white/60 border-b-black/[0.06] border-r-black/[0.06] bg-white/25 px-6 py-12 text-center text-sm text-[#6B7280] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.04)] backdrop-blur-xl">
              No published FAQs yet.
              <Link
                href="/dashboard"
                className="mt-4 block text-[11px] font-medium uppercase tracking-widest text-[#0A0A0A] underline underline-offset-4"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="mt-8">
              <FAQAccordion faqs={faqs} />
            </div>
          )}
        </section>

        <div className="mt-10 border-t border-black/[0.06] pt-10">
          <h2 className="text-xl font-normal tracking-tight text-[#0A0A0A]">
            Still need help?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
            Send a message and we’ll get back to you soon.
          </p>
          <div className="mt-6">
            <ContactForm
              redirectTo={`/faq/${userId}`}
              asModal
              allowAnonymous
            />
          </div>
        </div>
      </main>
    </div>
  );
}
