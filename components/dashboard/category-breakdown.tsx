// components/dashboard/category-breakdown.tsx

type Props = {
  byCategory: Record<string, number>;
};

// Assign a color to each category
const CATEGORY_COLORS: Record<string, string> = {
  Streaming: "bg-purple-100 text-purple-700",
  Music: "bg-green-100 text-green-700",
  Work: "bg-blue-100 text-blue-700",
  Utilities: "bg-orange-100 text-orange-700",
  Other: "bg-gray-100 text-gray-700",
};

export function CategoryBreakdown({ byCategory }: Props) {
  const total = Object.values(byCategory).reduce((a, b) => a + b, 0);
  const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-900 mb-4">By Category</h2>

      <ul className="space-y-3">
        {entries.map(([category, amount]) => {
          const percentage = ((amount / total) * 100).toFixed(0);
          const colorClass = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Other;

          return (
            <li key={category}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
                  {category}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  ₹{amount.toFixed(0)}
                  <span className="text-xs text-gray-400 font-normal ml-1">
                    ({percentage}%)
                  </span>
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-gray-400 h-1.5 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}