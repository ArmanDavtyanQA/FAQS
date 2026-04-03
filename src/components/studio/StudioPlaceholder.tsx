type Props = {
  taskRef: string;
  title: string;
  description: string;
};

/** Placeholder panel for upcoming platform modules (Q-003, Q-004, Q-006, …). */
export default function StudioPlaceholder({
  taskRef,
  title,
  description,
}: Props) {
  return (
    <div className="rounded-2xl border border-t-white/80 border-l-white/80 border-b-black/[0.06] border-r-black/[0.06] bg-white/40 p-10 shadow-[0_40px_100px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-[#4B5563]">
        {taskRef}
      </p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-[#0A0A0A]">
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6B7280]">
        {description}
      </p>
    </div>
  );
}
