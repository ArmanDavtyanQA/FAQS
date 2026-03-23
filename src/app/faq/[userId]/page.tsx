import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerAnon } from "@/lib/supabase/server";
import { dbListPublishedByUserId } from "@/lib/faq/supabase-faq";
import FAQAccordion from "@/components/faq/FAQAccordion";
import PublicFaqDashboardLink from "@/components/faq/PublicFaqDashboardLink";
import ContactForm from "@/components/ContactForm";

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
    <div className="min-h-screen bg-[#fafaf9] text-[#0a0a0a]">
      <PublicFaqDashboardLink ownerUserId={userId} />

      {/* Full-width hero — desktop edge-to-edge */}
      <section
        className="w-full bg-[#0a0a0a] text-white"
        aria-label="FAQ"
      >
        <div className="mx-auto flex min-h-[min(42vh,420px)] max-w-[100vw] items-center justify-center px-5 py-16 sm:min-h-[min(48vh,480px)] sm:px-8 sm:py-20 lg:min-h-[min(52vh,560px)] lg:py-28">
          <h1 className="text-center text-[clamp(4rem,18vw,12rem)] font-extralight leading-none tracking-[0.12em] text-white">
            FAQ
          </h1>
        </div>
      </section>

      <main className="mx-auto max-w-2xl px-5 py-12 sm:py-16 lg:max-w-3xl lg:px-8 lg:py-20">
        <section className="rounded-2xl border border-[#e8e6e3] bg-white px-5 py-8 shadow-sm shadow-black/[0.06] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <p className="label-caps mb-5 text-[#6b6b6b]">Browse answers</p>
          <h2 className="text-4xl font-normal tracking-tight text-[#0a0a0a] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
            Questions
          </h2>

          {faqs.length === 0 ? (
            <div className="mt-10 rounded-xl border border-dashed border-[#e8e6e3] bg-[#fafaf9] px-6 py-12 text-center text-sm text-[#6b6b6b]">
              No published FAQs yet.
              <Link
                href="/dashboard"
                className="mt-4 block text-[11px] font-medium uppercase tracking-widest text-[#0a0a0a] underline"
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

        <div className="mt-10 border-t border-[#e8e6e3] pt-10">
          <h2 className="text-xl font-normal tracking-tight text-[#0a0a0a]">
            Still need help?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">
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
