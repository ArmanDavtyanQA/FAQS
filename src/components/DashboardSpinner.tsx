type Props = {
  label?: string;
  /** Compact inline spinner (no label block spacing). */
  size?: "md" | "sm";
  className?: string;
};

export default function DashboardSpinner({
  label = "Loading…",
  size = "md",
  className = "",
}: Props) {
  const ring =
    size === "sm"
      ? "h-6 w-6 border-[1.5px]"
      : "h-10 w-10 border-2";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={`${ring} animate-spin rounded-full border-[#e8e6e3] border-t-[#0a0a0a]/80`}
        aria-hidden
      />
      {label ? (
        <p className="text-[11px] font-light uppercase tracking-widest text-[#6b6b6b]">
          {label}
        </p>
      ) : null}
    </div>
  );
}

/** Pulsing placeholder rows for FAQ table area */
export function DashboardTableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-[#e8e6e3] bg-surface shadow-xl shadow-black/5"
      aria-hidden
    >
      <div className="border-b border-[#e8e6e3] bg-surface-muted px-4 py-3">
        <div className="h-3 w-32 animate-pulse rounded bg-[#e8e6e3]" />
      </div>
      <div className="divide-y divide-[#e8e6e3]">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4">
            <div className="h-4 min-w-0 flex-1 animate-pulse rounded-md bg-[#f5f5f4]" />
            <div className="h-4 w-24 shrink-0 animate-pulse rounded-md bg-[#f5f5f4]" />
            <div className="h-4 w-16 shrink-0 animate-pulse rounded-md bg-[#f5f5f4]" />
          </div>
        ))}
      </div>
    </div>
  );
}
