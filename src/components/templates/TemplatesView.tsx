"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Info, Lock, Sparkles } from "lucide-react";
import { getProjectTheme, setProjectTheme } from "@/lib/studio/projectScope";

export type TemplateId = "minimalist" | "branded" | "quantum";

export type UserPlan = "free" | "pro";

/** Mock plan for local testing; replace with `useUser()` / context when wired. */
export const MOCK_USER_PLAN: UserPlan = "free";

const greek =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const greekShort = "Lorem ipsum dolor sit amet consectetur elit sed do.";

type TemplatesViewProps = {
  /** When omitted, uses `MOCK_USER_PLAN` until global auth supplies this. */
  userPlan?: UserPlan;
  /** Optional project scope for project-specific selected template. */
  projectId?: string;
  selectedId?: TemplateId | null;
  onSelect?: (id: TemplateId) => void;
  onPreviewLayout?: (id: TemplateId) => void;
};

const templates: {
  id: TemplateId;
  title: string;
  description: string;
}[] = [
  {
    id: "minimalist",
    title: "The Minimalist",
    description:
      "Strict black & white typography. Topics and answers in a calm editorial grid.",
  },
  {
    id: "branded",
    title: "The Branded",
    description:
      "Hero imagery with search-forward chrome—your logo and photography lead the story.",
  },
  {
    id: "quantum",
    title: "The Quantum Sync",
    description: "AI-assisted import from any URL with guided recommendations.",
  },
];

function isProOnlyTemplate(id: TemplateId): boolean {
  return id === "branded" || id === "quantum";
}

export function isTemplateLockedForPlan(id: TemplateId, plan: UserPlan): boolean {
  return plan === "free" && isProOnlyTemplate(id);
}

function MinimalistPreview() {
  return (
    <div className="flex h-full gap-2 rounded-lg border border-black/[0.08] bg-white p-2 sm:gap-3 sm:p-3">
      <div className="flex w-[28%] shrink-0 flex-col gap-1.5 border-r border-black/[0.08] pr-2">
        <p className="font-mono text-[6px] font-medium uppercase tracking-[0.2em] text-[#0A0A0A] sm:text-[7px]">
          Topic
        </p>
        <p className="text-[5px] font-medium leading-tight text-[#0A0A0A] sm:text-[6px]">
          Billing
        </p>
        <p className="text-[5px] leading-tight text-[#4B5563] sm:text-[6px]">
          {greekShort.slice(0, 42)}…
        </p>
        <p className="mt-0.5 font-mono text-[6px] font-medium uppercase tracking-[0.2em] text-[#0A0A0A] sm:text-[7px]">
          Topic
        </p>
        <p className="text-[5px] font-medium leading-tight text-[#0A0A0A] sm:text-[6px]">
          Shipping
        </p>
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div>
          <p className="text-[5px] font-semibold text-[#0A0A0A] sm:text-[6px]">
            Question heading alpha
          </p>
          <p className="mt-0.5 text-[5px] leading-snug text-[#4B5563] sm:text-[6px]">
            {greek.slice(0, 96)}…
          </p>
        </div>
        <div className="border-t border-black/[0.06] pt-1.5">
          <p className="text-[5px] font-semibold text-[#0A0A0A] sm:text-[6px]">
            Question heading beta
          </p>
          <p className="mt-0.5 text-[5px] leading-snug text-[#4B5563] sm:text-[6px]">
            {greek.slice(40, 130)}…
          </p>
        </div>
      </div>
    </div>
  );
}

function BrandedPreview() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-1.5">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-black/[0.08] bg-gradient-to-br from-[#e8e4df] via-[#d4cfc7] to-[#c4bdb2]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
        <div className="absolute bottom-1.5 left-1/2 w-[88%] max-w-[180px] -translate-x-1/2 rounded-full border border-white/60 bg-white/75 px-2 py-1 text-center shadow-sm backdrop-blur-sm sm:bottom-2">
          <p className="font-mono text-[5px] uppercase tracking-[0.15em] text-[#4B5563] sm:text-[6px]">
            Search topics…
          </p>
        </div>
        <p className="absolute left-2 top-2 font-mono text-[5px] uppercase tracking-[0.2em] text-white/90 drop-shadow sm:left-2.5 sm:top-2.5 sm:text-[6px]">
          Header imagery
        </p>
      </div>
      <div className="shrink-0 space-y-1 rounded-lg border border-black/[0.06] bg-white/60 p-1.5 sm:p-2">
        <p className="text-[5px] font-medium text-[#0A0A0A] sm:text-[6px]">
          FAQ item one — {greekShort.slice(0, 36)}…
        </p>
        <p className="text-[5px] text-[#4B5563] sm:text-[6px]">
          FAQ item two — {greekShort.slice(10, 52)}…
        </p>
        <p className="text-[5px] text-[#4B5563] sm:text-[6px]">
          FAQ item three — {greekShort.slice(5, 48)}…
        </p>
      </div>
    </div>
  );
}

const SCAN_DURATION_MS = 3500;

const syncStatusCopy = [
  "Analyzing CSS...",
  "Extracting Brand Palette...",
  "Generating Q&A...",
] as const;

function QuantumAiBadge() {
  return (
    <div className="absolute right-1.5 top-1.5 z-[5] sm:right-2 sm:top-2">
      <span className="inline-block rounded-full border border-black/[0.08] bg-white/70 px-2 py-0.5 font-mono text-[6px] font-medium uppercase tracking-[0.25em] text-[#4B5563] sm:text-[7px]">
        AI recommended
      </span>
    </div>
  );
}

/** Locked / static thumbnail (non-interactive). */
function QuantumPreviewStatic() {
  return (
    <div className="relative flex h-full flex-col gap-2 rounded-lg border border-black/[0.08] bg-white/50 p-2 sm:p-3">
      <QuantumAiBadge />
      <div className="mt-4 space-y-1.5 sm:mt-5">
        <p className="pr-20 font-mono text-[6px] uppercase tracking-[0.18em] text-[#4B5563] sm:text-[7px]">
          Source URL
        </p>
        <div className="flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-black/[0.03] px-2 py-1 sm:gap-2 sm:py-1.5">
          <span className="min-w-0 truncate font-mono text-[5px] text-[#4B5563] sm:text-[6px]">
            https://example.com/docs/help-center
          </span>
        </div>
      </div>
      <div className="mt-auto flex justify-end pt-1">
        <div className="rounded-lg bg-gradient-to-r from-violet-500 via-amber-400 to-cyan-500 p-px shadow-sm">
          <span className="block rounded-[7px] bg-white/90 px-3 py-1 font-mono text-[7px] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A] sm:text-[8px]">
            Sync
          </span>
        </div>
      </div>
    </div>
  );
}

function PrismaticScanBeam({ active }: { active: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 z-[8] h-[100px] -translate-y-1/2 blur-xl"
      initial={false}
      animate={
        active
          ? { top: ["0%", "100%"], opacity: 0.8 }
          : { top: "0%", opacity: 0 }
      }
      transition={
        active
          ? {
              duration: SCAN_DURATION_MS / 2000,
              ease: "easeInOut",
              repeat: 1,
              repeatType: "loop",
            }
          : { duration: 0.25 }
      }
    >
      <div
        className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 shadow-[0_0_40px_12px_rgba(251,191,36,0.35)]"
        style={{
          background:
            "linear-gradient(to right, transparent, #fbbf24, #ec4899, #8b5cf6, transparent)",
        }}
      />
      <div
        className="absolute inset-x-4 top-1/2 h-[100px] -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse 100% 50% at 50% 50%, rgba(251,191,36,0.35), rgba(236,72,153,0.2) 35%, rgba(139,92,246,0.25) 55%, transparent 72%)",
        }}
      />
    </motion.div>
  );
}

function QuantumEmptyScanContent() {
  return (
    <div className="flex h-full flex-col gap-1.5 p-1.5 sm:gap-2 sm:p-2">
      <div className="flex gap-2">
        <div className="w-1/3 shrink-0 space-y-1 rounded-md border border-black/[0.06] bg-white/80 p-1">
          <p className="font-mono text-[5px] uppercase tracking-[0.15em] text-[#4B5563] sm:text-[6px]">
            Nav
          </p>
          <p className="text-[5px] text-[#4B5563] sm:text-[6px]">{greekShort.slice(0, 28)}…</p>
        </div>
        <div className="min-w-0 flex-1 space-y-1 rounded-md border border-black/[0.06] bg-white/60 p-1.5">
          <p className="text-[5px] font-semibold text-[#4B5563] sm:text-[6px]">
            {greek.slice(0, 52)}…
          </p>
          <p className="text-[5px] leading-snug text-[#4B5563] sm:text-[6px]">
            {greek.slice(30, 110)}…
          </p>
        </div>
      </div>
      <div className="rounded-md border border-dashed border-black/[0.1] bg-black/[0.02] p-1">
        <p className="text-[5px] text-[#4B5563] sm:text-[6px]">
          {greekShort} — {greekShort}
        </p>
      </div>
    </div>
  );
}

function QuantumGeneratedPreview() {
  return (
    <motion.div
      initial={{ scale: 0.94, opacity: 0.75 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 26,
        mass: 0.85,
      }}
      className="flex h-full flex-col gap-1.5 p-1.5 sm:gap-2 sm:p-2"
    >
      <div className="flex items-center justify-between gap-2 rounded-md border border-emerald-500/25 bg-emerald-500/[0.07] px-2 py-1">
        <p className="font-mono text-[5px] font-medium uppercase tracking-[0.18em] text-emerald-800 sm:text-[6px]">
          Import complete
        </p>
        <span className="rounded-full bg-white/80 px-1.5 py-0.5 font-mono text-[5px] tabular-nums text-[#0A0A0A] sm:text-[6px]">
          12 Q&amp;A
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {["Overview", "Billing", "API"].map((label) => (
          <div
            key={label}
            className="rounded border border-black/[0.06] bg-white/90 py-1 text-center font-mono text-[5px] uppercase tracking-[0.12em] text-[#4B5563] sm:text-[6px]"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="space-y-1 rounded-md border border-black/[0.06] bg-white/70 p-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex gap-1.5 border-b border-black/[0.05] pb-1 last:border-0 last:pb-0"
          >
            <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500/80" />
            <div className="min-w-0">
              <p className="text-[5px] font-medium text-[#0A0A0A] sm:text-[6px]">
                Structured question {i} — {greekShort.slice(0, 24)}…
              </p>
              <p className="text-[5px] leading-snug text-[#4B5563] sm:text-[6px]">
                {greek.slice(i * 12, i * 12 + 64)}…
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function QuantumSyncInteractive() {
  const [url, setUrl] = useState("https://example.com/docs/help-center");
  const [isScanning, setIsScanning] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const scanFinishTimeoutRef = useRef<number | null>(null);

  const clearScanFinishTimeout = () => {
    if (scanFinishTimeoutRef.current !== null) {
      window.clearTimeout(scanFinishTimeoutRef.current);
      scanFinishTimeoutRef.current = null;
    }
  };

  useEffect(() => () => clearScanFinishTimeout(), []);

  useEffect(() => {
    if (!isScanning) return;
    setStatusIdx(0);
    const step = SCAN_DURATION_MS / 3;
    const t1 = window.setTimeout(() => setStatusIdx(1), step);
    const t2 = window.setTimeout(() => setStatusIdx(2), step * 2);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [isScanning]);

  const runQuantumSync = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    let parsed: URL | null = null;
    try {
      parsed = new URL(trimmed);
    } catch {
      return;
    }
    if (!parsed.protocol.startsWith("http")) return;

    setSyncComplete(false);
    setIsScanning(true);

    clearScanFinishTimeout();
    scanFinishTimeoutRef.current = window.setTimeout(() => {
      scanFinishTimeoutRef.current = null;
      setIsScanning(false);
      setSyncComplete(true);
      void import("canvas-confetti").then((mod) => {
        mod.default({
          particleCount: 64,
          spread: 58,
          startVelocity: 28,
          scalar: 0.9,
          origin: { y: 0.72, x: 0.5 },
          colors: ["#fbbf24", "#ec4899", "#8b5cf6", "#FDFDFB", "#0A0A0A"],
        });
      });
    }, SCAN_DURATION_MS);
  };

  const buttonLabel = isScanning
    ? syncStatusCopy[Math.min(statusIdx, 2)]
    : "Quantum Sync";

  return (
    <div
      className="relative flex h-full min-h-0 flex-col gap-2 rounded-lg border border-black/[0.08] bg-white/50 p-2 sm:p-3"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      role="presentation"
    >
      <QuantumAiBadge />

      <div className="relative z-[2] mt-5 space-y-1 sm:mt-6">
        <label
          htmlFor="quantum-sync-url"
          className="block pr-20 font-mono text-[6px] uppercase tracking-[0.18em] text-[#4B5563] sm:text-[7px]"
        >
          Source URL
        </label>
        <input
          id="quantum-sync-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isScanning}
          className="w-full rounded-lg border border-black/[0.08] bg-black/[0.03] px-2 py-1 font-mono text-[5px] text-[#0A0A0A] outline-none ring-yellow-500/0 transition-shadow placeholder:text-[#9CA3AF] focus:border-yellow-500/40 focus:ring-2 focus:ring-yellow-500/20 disabled:opacity-60 sm:py-1.5 sm:text-[6px]"
          placeholder="https://yoursite.com/help"
        />
      </div>

      <div className="relative z-[1] min-h-0 flex-1 overflow-hidden rounded-lg border border-black/[0.07] bg-[#FDFDFB]/90">
        <PrismaticScanBeam active={isScanning} />
        <motion.div
          className="relative z-[3] h-full min-h-[100px] overflow-hidden"
          animate={
            isScanning
              ? {
                  filter: [
                    "brightness(1) saturate(1)",
                    "brightness(1.2) saturate(1.28)",
                    "brightness(1) saturate(1)",
                    "brightness(1.22) saturate(1.22)",
                    "brightness(1) saturate(1)",
                  ],
                }
              : { filter: "brightness(1) saturate(1)" }
          }
          transition={{
            duration: SCAN_DURATION_MS / 1000,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        >
          {syncComplete ? (
            <QuantumGeneratedPreview />
          ) : (
            <QuantumEmptyScanContent />
          )}
        </motion.div>
      </div>

      <div className="relative z-[4] mt-auto flex justify-end pt-1">
        <div className="rounded-lg bg-gradient-to-r from-violet-500 via-amber-400 to-cyan-500 p-px shadow-sm">
          <button
            type="button"
            disabled={isScanning}
            onClick={(e) => {
              e.stopPropagation();
              runQuantumSync();
            }}
            className="min-w-[7rem] rounded-[7px] bg-white/95 px-2.5 py-1 text-center font-mono text-[6px] font-semibold uppercase leading-tight tracking-[0.12em] text-[#0A0A0A] transition-opacity disabled:cursor-wait disabled:opacity-90 sm:min-w-[9.5rem] sm:px-3 sm:text-[7px] sm:tracking-[0.16em]"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlaySpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 36,
};

const panelSpring = {
  type: "spring" as const,
  stiffness: 360,
  damping: 30,
};

const ov = { closed: { opacity: 0 }, open: { opacity: 1 } };
const pan = {
  closed: { opacity: 0, scale: 0.94, y: 20 },
  open: { opacity: 1, scale: 1, y: 0 },
};

function ProPricingModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/10 backdrop-blur-md"
            variants={ov}
            initial={false}
            animate={open ? "open" : "closed"}
            transition={overlaySpring}
          />
        </Dialog.Overlay>
        <Dialog.Content className="fixed inset-0 z-[110] m-0 grid place-items-center border-0 bg-transparent p-4 shadow-none outline-none focus:outline-none pointer-events-none">
          <motion.div
            variants={pan}
            initial={false}
            animate={open ? "open" : "closed"}
            transition={panelSpring}
            className="panel-base glass-slab pointer-events-auto w-full max-w-md rounded-2xl p-6 shadow-[0_100px_200px_-50px_rgba(0,0,0,0.12)] backdrop-blur-3xl sm:p-8"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-700">
              <Sparkles className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </div>
            <Dialog.Title className="text-xl font-semibold tracking-tight text-ui-strong">
              Unlock Pro templates
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-relaxed text-ui-muted">
              Custom branding, hero layouts, and AI-assisted sync are included
              on the Paid plan. Upgrade to activate these layouts on your public
              FAQ.
            </Dialog.Description>
            <div className="mt-6 flex flex-wrap gap-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="btn-ui btn-ui-ghost h-11 rounded-2xl px-5 text-sm"
                >
                  Not now
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Link
                  href="/billing"
                  className="btn-ui btn-ui-primary inline-flex h-11 items-center justify-center rounded-2xl px-6 text-sm transition-[transform,box-shadow] hover:scale-[1.02]"
                >
                  Continue to billing
                </Link>
              </Dialog.Close>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function LockedProOverlay({
  onOpenPricing,
}: {
  onOpenPricing: () => void;
}) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/40 backdrop-blur-md"
        aria-hidden
      >
        <Lock
          className="h-9 w-9 shrink-0 text-[#0A0A0A] opacity-60 sm:h-10 sm:w-10"
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
      <div className="group/tooltip absolute right-3 top-3 z-30 sm:right-4 sm:top-4">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] bg-white/75 text-[#0A0A0A] shadow-sm backdrop-blur-md transition-colors hover:bg-white hover:border-black/[0.12] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/40"
          aria-label="Why is this template locked?"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Info className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        </button>
        <div
          role="tooltip"
          className="invisible absolute right-0 top-full z-40 mt-2 w-[min(100vw-3rem,280px)] rounded-xl border border-b border-r border-black/[0.08] border-l border-t border-l-white/80 border-t-white/90 bg-white/75 px-3 py-2.5 font-mono text-[10px] leading-relaxed text-[#4B5563] opacity-0 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-[opacity,visibility] duration-200 group-hover/tooltip:visible group-hover/tooltip:opacity-100 pointer-events-none group-hover/tooltip:pointer-events-auto"
        >
          This AI-powered design and custom branding are exclusive to the Paid
          Plan.{" "}
          <button
            type="button"
            className="font-medium text-yellow-600 underline decoration-yellow-600/80 underline-offset-2 hover:text-yellow-700"
            onClick={(e) => {
              e.stopPropagation();
              onOpenPricing();
            }}
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </>
  );
}

export default function TemplatesView({
  userPlan: userPlanProp,
  projectId,
  selectedId: controlledId,
  onSelect,
  onPreviewLayout,
}: TemplatesViewProps) {
  const effectivePlan = userPlanProp ?? MOCK_USER_PLAN;
  const [internalSelection, setInternalSelection] = useState<{
    projectId: string | null;
    id: TemplateId | null;
  }>({ projectId: null, id: null });
  const storedProjectTheme = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      window.addEventListener("storage", onStoreChange);
      return () => window.removeEventListener("storage", onStoreChange);
    },
    () => (projectId ? getProjectTheme(projectId) : null),
    () => null,
  );
  const internalId =
    internalSelection.projectId === (projectId ?? null)
      ? internalSelection.id
      : null;
  const selectedId =
    controlledId !== undefined ? controlledId : internalId ?? storedProjectTheme;
  const [pricingOpen, setPricingOpen] = useState(false);

  useEffect(() => {
    if (controlledId !== undefined || !projectId) return;
    setProjectTheme(projectId, selectedId ?? null);
  }, [controlledId, projectId, selectedId]);

  const selectUnlocked = (id: TemplateId) => {
    if (controlledId === undefined) {
      setInternalSelection({ projectId: projectId ?? null, id });
    }
    onSelect?.(id);
  };

  const handleCardActivate = (id: TemplateId) => {
    if (isTemplateLockedForPlan(id, effectivePlan)) {
      setPricingOpen(true);
      return;
    }
    selectUnlocked(id);
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <ProPricingModal open={pricingOpen} onOpenChange={setPricingOpen} />

      <h2 className="text-2xl font-semibold tracking-tight text-[#0A0A0A] sm:text-3xl">
        Choose your aesthetic
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#4B5563] sm:text-base">
        Select a layout to power your public FAQ page
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {templates.map((t) => {
          const locked = isTemplateLockedForPlan(t.id, effectivePlan);
          const isSelected = selectedId === t.id;
          const showSelectionBorder = isSelected && !locked;

          return (
            <div key={t.id} className="group relative">
              <div
                role="button"
                tabIndex={0}
                aria-pressed={locked ? undefined : isSelected}
                aria-disabled={locked}
                aria-label={
                  locked
                    ? `Upgrade to unlock: ${t.title}`
                    : `Select template: ${t.title}`
                }
                onClick={() => handleCardActivate(t.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardActivate(t.id);
                  }
                }}
                className={`glass-slab relative flex w-full cursor-pointer flex-col rounded-2xl border-2 text-left shadow-[20px_0_50px_rgba(0,0,0,0.02)] transition-[border-color,box-shadow] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/40 ${
                  locked ? "overflow-visible" : "overflow-hidden antigravity-lift"
                } ${
                  showSelectionBorder
                    ? "border-[#0A0A0A]"
                    : locked
                      ? "border-black/[0.06] hover:border-black/[0.1]"
                      : "border-black/[0.06] hover:border-black/[0.12]"
                }`}
              >
                {locked ? <LockedProOverlay onOpenPricing={() => setPricingOpen(true)} /> : null}

                <div className="border-b border-black/[0.06] px-4 pb-3 pt-4">
                  <h3 className="text-base font-semibold tracking-tight text-[#0A0A0A]">
                    {t.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#4B5563]">
                    {t.description}
                  </p>
                </div>

                <div className="relative bg-[#FDFDFB]/80 p-3 sm:p-4">
                  <div className="aspect-video w-full overflow-hidden rounded-xl border border-black/[0.05] bg-white/40">
                    <div className="h-full w-full p-2 sm:p-2.5">
                      {t.id === "minimalist" ? (
                        <MinimalistPreview />
                      ) : t.id === "branded" ? (
                        <BrandedPreview />
                      ) : locked ? (
                        <QuantumPreviewStatic />
                      ) : (
                        <QuantumSyncInteractive />
                      )}
                    </div>
                  </div>
                </div>

                {!locked ? (
                  <div className="flex min-h-[3.25rem] items-center justify-center border-t border-black/[0.06] px-3 py-2">
                    <button
                      type="button"
                      className="pointer-events-none rounded-xl border border-black/[0.08] bg-white/50 px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#4B5563] opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100 hover:border-[#0A0A0A]/20 hover:text-[#0A0A0A]"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewLayout?.(t.id);
                      }}
                    >
                      Preview layout
                    </button>
                  </div>
                ) : (
                  <div className="min-h-[3.25rem] border-t border-black/[0.06]" aria-hidden />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
