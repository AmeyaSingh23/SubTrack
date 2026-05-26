"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { ServiceLogo } from "@/components/ui/service-logo";

const COLORS: Record<string, string> = {
  Streaming: "#f59e0b",
  Music:     "#10b981",
  Work:      "#3b82f6",
  Utilities: "#f97316",
  Health:    "#ec4899",
  Other:     "#6b7280",
};

type Props = {
  byCategory: Record<string, number>;
  monthlyTrend: { month: string; total: number }[];
  topSubs: { name: string; monthly: number; billingCycle: string; amount: number }[];
  totalMonthly: number;
  historicalByCategory: Record<string, number>;
  totalHistorical: number;
  cancelledSubs: { name: string; category: string; monthsActive: number; totalSpent: number }[];
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--bg)] border border-[var(--border)] px-3 py-2">
      <p className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="font-mono text-sm font-bold text-[var(--text-primary)]">
        ₹{payload[0].value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-6">
      <span className="font-mono text-[10px] text-[var(--accent)] tracking-widest">
        {num}
      </span>
      <h2 className="font-bold text-lg tracking-tight text-[var(--text-primary)]">{title}</h2>
    </div>
  );
}

export function AnalyticsCharts({
  byCategory,
  monthlyTrend,
  topSubs,
  totalMonthly,
  historicalByCategory,
  totalHistorical,
  cancelledSubs,
}: Props) {
  const categoryEntries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const pieData = categoryEntries.map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));

  const historicalEntries = Object.entries(historicalByCategory).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="px-4 sm:px-8 py-8 space-y-12">

      {/* ── SECTION A: ACTIVE BURN ── */}
      <div>
        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-[var(--border-subtle)]">
          <div className="w-1.5 h-6 bg-[var(--accent)]" />
          <div>
            <p className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-widest">
              Active Burn
            </p>
            <p className="font-mono text-xs text-[var(--text-muted)]">
              What you&apos;re paying right now
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
              ₹{Math.round(totalMonthly).toLocaleString("en-IN")}
              <span className="text-[var(--text-muted)] text-sm font-normal">/mo</span>
            </p>
            <p className="font-mono text-[10px] text-[var(--text-muted)]">
              ₹{Math.round(totalMonthly * 12).toLocaleString("en-IN")}/yr
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Trend line */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-4 sm:p-6">
            <SectionLabel num="01" title="Monthly Spend — Last 6 Months" />
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={monthlyTrend}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <XAxis
                  dataKey="month"
                  tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#c8ff00"
                  strokeWidth={2}
                  dot={{ fill: "#c8ff00", strokeWidth: 0, r: 3 }}
                  activeDot={{ fill: "#c8ff00", r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donut */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6">
              <SectionLabel num="02" title="By Category" />
              {pieData.length === 0 ? (
                <p className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-widest">
                  No active subscriptions
                </p>
              ) : (
                <div className="flex fex-col sm:flex-row items-center gap-6">
                  <PieChart width={140} height={140}>
                    <Pie
                      data={pieData}
                      cx={65}
                      cy={65}
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[entry.name] ?? COLORS.Other}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                  <ul className="space-y-2 w-full">
                    {categoryEntries.map(([cat, amount]) => (
                      <li key={cat} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: COLORS[cat] ?? COLORS.Other }}
                          />
                          <span className="font-mono text-[11px] text-[var(--text-secondary)] uppercase tracking-widest">
                            {cat}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-[var(--text-primary)]">
                          ₹{Math.round(amount)}/mo
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Top subs */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6">
              <SectionLabel num="03" title="Most Expensive" />
              {topSubs.length === 0 ? (
                <p className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-widest">
                  No active subscriptions
                </p>
              ) : (
                <ul className="divide-y divide-[var(--border-subtle)]">
                  {topSubs.map((sub, i) => (
                    <li key={sub.name} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-[var(--accent)] w-4">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <ServiceLogo name={sub.name} size={28} className="shrink-0 rounded-md" />
                        <div>
                          <p className="text-sm font-bold text-[var(--text-primary)]">{sub.name}</p>
                          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                            {sub.billingCycle} · ₹{sub.amount}
                          </p>
                        </div>
                      </div>
                      <p className="font-mono text-sm font-bold text-[var(--text-primary)]">
                        ₹{Math.round(sub.monthly)}
                        <span className="text-[var(--text-muted)] font-normal">/mo</span>
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION B: HISTORICAL SPEND ── */}
      <div>
        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-[var(--border-subtle)]">
          <div className="w-1.5 h-6 bg-[var(--text-muted)]" />
          <div>
            <p className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">
              Historical Spend
            </p>
            <p className="font-mono text-xs text-[var(--text-muted)]">
              Total estimated spend across all subscriptions ever
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-black tracking-tight text-[var(--text-secondary)]">
              ₹{Math.round(totalHistorical).toLocaleString("en-IN")}
            </p>
            <p className="font-mono text-[10px] text-[var(--text-muted)]">
              lifetime estimate
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Historical by category */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6">
            <SectionLabel num="04" title="Lifetime by Category" />
            <ul className="space-y-3">
              {historicalEntries.map(([cat, total]) => {
                const pct = Math.round((total / totalHistorical) * 100);
                return (
                  <li key={cat}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: COLORS[cat] ?? COLORS.Other }}
                        />
                        <span className="font-mono text-[11px] text-[var(--text-secondary)] uppercase tracking-widest">
                          {cat}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">
                          {pct}%
                        </span>
                        <span className="font-mono text-[11px] font-bold text-[var(--text-secondary)] w-20 text-right">
                          ₹{Math.round(total).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-[var(--bg-card)] rounded-full h-1">
                      <div
                        className="h-1 rounded-full"
                        style={{
                          width: `${Math.min(pct, 100)}%`,
                          backgroundColor: COLORS[cat] ?? COLORS.Other,
                          opacity: 0.5,
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Cancelled subs */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6">
            <SectionLabel num="05" title="Cancelled Subscriptions" />
            {cancelledSubs.length === 0 ? (
              <p className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-widest">
                No cancelled subscriptions
              </p>
            ) : (
              <ul className="divide-y divide-[var(--border-subtle)]">
                {cancelledSubs.map((sub) => (
                  <li key={sub.name} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <ServiceLogo name={sub.name} size={28} className="shrink-0 rounded-md opacity-40" />
                      <div>
                        <p className="text-sm font-bold text-[var(--text-secondary)]">{sub.name}</p>
                        <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-0.5">
                          {sub.category} · {sub.monthsActive}mo
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-bold text-[var(--text-secondary)]">
                        ₹{sub.totalSpent.toLocaleString("en-IN")}
                      </p>
                      <p className="font-mono text-[10px] text-[var(--text-muted)]">
                        total spent
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p className="font-mono text-[9px] text-[var(--text-faint)] mt-4 uppercase tracking-widest">
          * Historical figures are estimates based on subscription duration and billing cycle.
          Actual amounts may vary due to price changes, pauses, or partial months.
        </p>
      </div>
    </div>
  );
}
