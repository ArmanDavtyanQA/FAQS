import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col gap-6">
      <div>
        <Link
          href="/dashboard"
          className="text-[11px] font-medium uppercase tracking-widest text-[#6b6b6b] hover:text-[#0a0a0a]"
        >
          ← Dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#0a0a0a]">
          Contact
        </h1>
        <p className="mt-1 text-sm text-[#6b6b6b]">
          Send a message to our team. We’ll get back to you soon.
        </p>
      </div>

      <ContactForm defaultOpen />
    </main>
  );
}

