"use client";

import { useId, useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/** Single headline metric for the lens row (API-ready). */
export type AnalyticsLensMetric = {
  id: string;
  label: string;
  /** Pre-formatted for display, e.g. "$128,400.00" or "1,248" */
  valueFormatted: string;
  /** Faint radial behind the number (premium terminal accent). */
  glow:
    | "amber"
    | "slate"
    | "emerald";
};

/** One point on the performance series (API-ready). */
export type AnalyticsPerformancePoint = {
  /** Short date label for X-axis, e.g. "Jan 4" */
  date: string;
  /** Order count (or any series value) for the area. */
  orders: number;
};

export type AnalyticsViewProps = {
  metrics?: AnalyticsLensMetric[];
  performanceData?: AnalyticsPerformancePoint[];
};

const GLOW_STYLES: Record<
  AnalyticsLensMetric["glow"],
  string
> = {
  amber:
    "bg-[radial-gradient(ellipse_85%_65%_at_50%_58%,rgba(234,179,8,0.06)_0%,rgba(234,179,8,0.02)_42%,transparent_72%)]",
  slate:
    "bg-[radial-gradient(ellipse_85%_65%_at_50%_58%,rgba(71,85,105,0.05)_0%,rgba(71,85,105,0.02)_42%,transparent_72%)]",
  emerald:
    "bg-[radial-gradient(ellipse_85%_65%_at_50%_58%,rgba(16,185,129,0.05)_0%,rgba(16,185,129,0.02)_42%,transparent_72%)]",
};

export const MOCK_ANALYTICS_METRICS: AnalyticsLensMetric[] = [
  {
    id: "total-amount",
    label: "Total Amount",
    valueFormatted: "$284,960.00",
    glow: "amber",
  },
  {
    id: "avg-order",
    label: "Average Order Amount",
    valueFormatted: "$228.40",
    glow: "slate",
  },
  {
    id: "orders-count",
    label: "Orders Count",
    valueFormatted: "1,248",
    glow: "emerald",
  },
];

function buildMockPerformanceSeries(): AnalyticsPerformancePoint[] {
  const out: AnalyticsPerformancePoint[] = [];
  const start = new Date();
  start.setDate(start.getDate() - 27);
  for (let i = 0; i < 28; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const wave =
      42 +
      Math.sin(i / 3.2) * 18 +
      (i > 18 ? (i - 18) * 2.5 : 0) +
      (Math.random() * 8 - 4);
    out.push({ date: label, orders: Math.max(12, Math.round(wave)) });
  }
  return out;
}

export const MOCK_PERFORMANCE_DATA: AnalyticsPerformancePoint[] =
  buildMockPerformanceSeries();

const labelMono =
  "font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ui-muted";

type TooltipPayload = { value?: number; dataKey?: string };

function PerformanceTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  const v = row?.value;
  if (v === undefined) return null;
  return (
    <div className="panel-base glass-slab rounded-xl px-3.5 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      <p className={`${labelMono} text-ui-subtle`}>{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-ui-strong">
        {v.toLocaleString()} orders
      </p>
    </div>
  );
}

export default function AnalyticsView({
  metrics = MOCK_ANALYTICS_METRICS,
  performanceData = MOCK_PERFORMANCE_DATA,
}: AnalyticsViewProps) {
  const gradientId = useId().replace(/:/g, "");
  const fillId = `perf-area-${gradientId}`;

  const chartData = useMemo(
    () => performanceData.map((d) => ({ ...d })),
    [performanceData],
  );

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
        {metrics.map((m) => (
          <div
            key={m.id}
            className="panel-base glass-slab relative overflow-hidden rounded-2xl p-6 shadow-[20px_0_50px_rgba(0,0,0,0.02)]"
          >
            <p className={labelMono}>{m.label}</p>
            <div className="relative mt-4 min-h-[4.5rem] sm:min-h-[5.5rem]">
              <div
                className={`pointer-events-none absolute inset-0 -translate-y-1 scale-110 ${GLOW_STYLES[m.glow]}`}
                aria-hidden
              />
              <p className="relative font-mono text-5xl font-bold leading-[0.95] tracking-tight text-ui-strong sm:text-6xl lg:text-[72px] lg:leading-[0.9]">
                {m.valueFormatted}
              </p>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-10 md:mt-12">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className={labelMono}>Performance</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-ui-strong sm:text-xl">
              Order trends
            </h2>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ui-subtle">
            Last 28 days
          </p>
        </div>

        <div className="panel-base glass-slab rounded-2xl p-4 shadow-[20px_0_50px_rgba(0,0,0,0.02)] sm:p-6">
          <div className="h-[min(420px,55vh)] w-full min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="rgb(10, 10, 10)"
                      stopOpacity={0.05}
                    />
                    <stop
                      offset="100%"
                      stopColor="rgb(10, 10, 10)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  interval="preserveStartEnd"
                  minTickGap={28}
                  tick={{
                    fontSize: 10,
                    fontFamily:
                      "var(--font-jetbrains-mono), ui-monospace, monospace",
                    fill: "#6B7280",
                    fontWeight: 500,
                  }}
                />
                <YAxis hide width={0} />
                <Tooltip
                  content={<PerformanceTooltip />}
                  cursor={{
                    stroke: "rgba(10,10,10,0.12)",
                    strokeWidth: 1,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#0A0A0A"
                  strokeWidth={1}
                  fill={`url(#${fillId})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
