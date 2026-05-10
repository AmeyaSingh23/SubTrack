type Props = {
  byCategory: Record<string, number>;
  monthlyTotal: number;
};

const CATEGORY_COLORS: Record<string, string> = {
  Streaming: "#f59e0b",
  Music:     "#10b981",
  Work:      "#3b82f6",
  Utilities: "#f97316",
  Health:    "#ec4899",
  Other:     "#6b7280",
};

export function CategoryBreakdown({ byCategory, monthlyTotal }: Props) {
  const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-white/3 border border-white/7 rounded-xl p-5">
      <p className="text-[11px] font-mono text-white/30 uppercase tracking-widest mb-4">
        By Category
      </p>

      <ul className="space-y-3">
        {entries.map(([category, amount]) => {
          const pct = Math.round((amount / monthlyTotal) * 100);
          const color = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Other;

          return (
            <li key={category}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-mono text-white/50">
                    {category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-white/25">
                    {pct}%
                  </span>
                  <span className="text-sm font-mono font-semibold text-white/70 w-16 text-right">
                    ₹{amount.toFixed(0)}
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-white/5 rounded-full h-1">
                <div
                  className="h-1 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}