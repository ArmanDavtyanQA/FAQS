/**
 * Soft side columns + blurred vertical streaks (PULSE-style atmospheric light).
 */
export default function AmbientColorBubbles() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {/* Tall warm columns at left / right */}
      <div className="absolute -left-[20%] top-[-10%] h-[120%] w-[min(55%,32rem)] rounded-[100%] bg-gradient-to-r from-amber-200/30 via-yellow-100/15 to-transparent blur-[clamp(48px,8vw,100px)]" />
      <div className="absolute -right-[20%] top-[-10%] h-[120%] w-[min(55%,32rem)] rounded-[100%] bg-gradient-to-l from-orange-200/25 via-amber-100/12 to-transparent blur-[clamp(48px,8vw,100px)]" />
      {/* Diffused vertical ray bands (heavily blurred) */}
      <div
        className="absolute inset-y-0 left-0 w-[min(42%,24rem)] opacity-[0.55]"
        style={{
          background:
            "repeating-linear-gradient(92deg, transparent 0 36px, rgba(255, 190, 100, 0.14) 36px 37px, transparent 37px 72px)",
          filter: "blur(28px)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-[min(42%,24rem)] opacity-[0.55]"
        style={{
          background:
            "repeating-linear-gradient(-92deg, transparent 0 36px, rgba(255, 190, 100, 0.14) 36px 37px, transparent 37px 72px)",
          filter: "blur(28px)",
        }}
      />
    </div>
  );
}
