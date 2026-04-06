"use client";

type Props = {
  title: string;
  breadcrumbs: string[];
};

export default function StudioMainHeader({ title, breadcrumbs }: Props) {
  const crumbText = breadcrumbs.join(" / ");

  return (
    <header className="mb-10 flex flex-wrap items-start justify-between gap-4 border-b border-black/[0.08] pb-6">
      <h1 className="text-2xl font-semibold tracking-tight text-ui-strong sm:text-3xl">
        {title}
      </h1>
      <p
        className="label-caps max-w-full pt-1 text-ui-muted"
        aria-label={`Breadcrumb: ${crumbText}`}
      >
        {crumbText}
      </p>
    </header>
  );
}
