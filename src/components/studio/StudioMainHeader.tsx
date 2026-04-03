"use client";

type Props = {
  title: string;
  breadcrumbs: string[];
};

export default function StudioMainHeader({ title, breadcrumbs }: Props) {
  const crumbText = breadcrumbs.join(" / ");

  return (
    <header className="mb-10 flex flex-wrap items-start justify-between gap-4 border-b border-black/[0.06] pb-6">
      <h1 className="text-2xl font-semibold tracking-tight text-[#0A0A0A] sm:text-3xl">
        {title}
      </h1>
      <p
        className="max-w-full pt-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#4B5563]"
        aria-label={`Breadcrumb: ${crumbText}`}
      >
        {crumbText}
      </p>
    </header>
  );
}
