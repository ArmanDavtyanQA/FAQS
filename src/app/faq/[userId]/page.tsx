import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerAnon } from "@/lib/supabase/server";
import { dbListPublishedByUserId } from "@/lib/faq/supabase-faq";
import FAQAccordion from "@/components/faq/FAQAccordion";
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
      <header className="border-b border-[#e8e6e3] bg-white shadow-md shadow-black/5">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-5 py-5">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#0a0a0a]">
            Help
          </span>
          <Link
            href="/"
            className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#6b6b6b] hover:text-[#0a0a0a]"
          >
            FAQ Studio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-14">
        <p className="label-caps mb-4">Frequently asked</p>
        <h1 className="text-3xl font-normal tracking-tight text-[#0a0a0a]">
          Questions
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#6b6b6b]">
          Select a question to read the answer.
        </p>

        {faqs.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-[#e8e6e3] bg-white px-6 py-12 text-center text-sm text-[#6b6b6b] shadow-xl shadow-black/5">
            No published FAQs yet.
            <Link
              href="/dashboard"
              className="mt-4 block text-[11px] font-medium uppercase tracking-widest text-[#0a0a0a] underline"
            >
              Dashboard
            </Link>
          </div>
        ) : (
          <div className="mt-10">
            <FAQAccordion faqs={faqs} />
          </div>
        )}

        <p className="mt-16 text-[10px] uppercase tracking-[0.2em] text-[#6b6b6b]">
          FAQ Studio
        </p>

        <div className="mt-10 border-t border-[#e8e6e3] pt-10">
          <p className="label-caps mb-3 text-[#6b6b6b]">Contact</p>
          <h2 className="text-xl font-normal tracking-tight text-[#0a0a0a]">
            Still need help?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">
            Send a message and we’ll get back to you soon.
          </p>
          <div className="mt-6">
            <ContactForm redirectTo={`/faq/${userId}`} />
          </div>
        </div>
      </main>
    </div>
  );
}
