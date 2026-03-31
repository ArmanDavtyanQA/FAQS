/**
 * Fixed, non-interactive depth — neutral slate only (keeps focus on content).
 */
export default function AmbientColorBubbles() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute -right-[10%] top-[10%] h-[min(22rem,48vw)] w-[min(22rem,48vw)] rounded-full bg-slate-400/[0.06] blur-[clamp(64px,10vw,100px)]" />
      <div className="absolute -left-[8%] bottom-[20%] h-[min(18rem,42vw)] w-[min(18rem,42vw)] rounded-full bg-slate-500/[0.05] blur-[clamp(56px,9vw,88px)]" />
    </div>
  );
}
