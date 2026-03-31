import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Defaults to max-w-5xl row; use e.g. max-w-2xl for public FAQ owner bar */
  innerClassName?: string;
};

const defaultInner =
  "mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5";

/**
 * Inset dashboard sub-header — white / cool grey (readable with body canvas).
 */
export default function DashboardAreaHeader({
  children,
  innerClassName = defaultInner,
}: Props) {
  return (
    <div className="px-4 pt-3 sm:px-6 sm:pt-4 lg:px-10 lg:pt-5">
      <header className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/80 to-slate-100/60 shadow-md shadow-slate-900/[0.05]">
        <div className={innerClassName}>{children}</div>
      </header>
    </div>
  );
}
