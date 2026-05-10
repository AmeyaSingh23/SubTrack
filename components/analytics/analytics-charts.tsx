"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

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
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a0a0a] border border-white/10 px-3 py-2">
      <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="font-mono text-sm font-bold text-white">
        ₹{payload[0].value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

export function AnalyticsCharts({ byCategory, monthlyTrend, topSubs, totalMonthly }: Props) {
  const categoryEntries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const pieData = categoryEntries.map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));

  return (
    <div className="px-8 py-8 space-y-8">

      {/* Trend chart */}
      <div className="bg-white/3 border border-white/7 p-6">
        <p className="font-mono text-[10px] text-[#c8ff00] uppercase tracking-widest mb-1">
          01
        </p>
        <h2 className="font-bold text-lg tracking-tight text-white mb-6">
          Monthly Spend — Last 6 Months
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={monthlyTrend}
            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
          >
            <XAxis
              dataKey="month"
              tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "rgba(255,255,255,0.2)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "rgba(255,255,255,0.2)" }}
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

        {/* Donut chart */}
        <div className="bg-white/3 border border-white/7 p-6">
          <p className="font-mono text-[10px] text-[#c8ff00] uppercase tracking-widest mb-1">
            02
          </p>
          <h2 className="font-bold text-lg tracking-tight text-white mb-6">
            By Category
          </h2>
          <div className="flex items-center gap-6">
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

            <ul className="space-y-2 flex-1">
              {categoryEntries.map(([cat, amount]) => (
                <li key={cat} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[cat] ?? COLORS.Other }}
                    />
                    <span className="font-mono text-[11px] text-white/40 uppercase tracking-widest">
                      {cat}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-white/70">
                    ₹{Math.round(amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Top subscriptions */}
        <div className="bg-white/3 border border-white/7 p-6">
          <p className="font-mono text-[10px] text-[#c8ff00] uppercase tracking-widest mb-1">
            03
          </p>
          <h2 className="font-bold text-lg tracking-tight text-white mb-6">
            Most Expensive
          </h2>
          <ul className="divide-y divide-white/6">
            {topSubs.map((sub, i) => (
              <li key={sub.name} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-[#c8ff00] w-4">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white/80">{sub.name}</p>
                    <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
                      {sub.billingCycle} · ₹{sub.amount}
                    </p>
                  </div>
                </div>
                <p className="font-mono text-sm font-bold text-white/70">
                  ₹{Math.round(sub.monthly)}
                  <span className="text-white/20 font-normal">/mo</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Summary */}
      <div className="border-t border-white/6 pt-6">
        <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
          Total active monthly spend
        </p>
        <p className="text-4xl font-black tracking-[-0.04em] text-white mt-1">
          ₹{Math.round(totalMonthly).toLocaleString("en-IN")}
          <span className="text-white/20 text-xl font-normal">/mo</span>
        </p>
        <p className="font-mono text-[11px] text-white/20 mt-1">
          ₹{Math.round(totalMonthly * 12).toLocaleString("en-IN")} per year
        </p>
      </div>
    </div>
  );
}