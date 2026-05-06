// components/dashboard/burn-rate-cards.tsx
// This receives pre-calculated data as props from the Server Component above.
// It doesn't need "use client" because it has no interactivity — 
// it just displays numbers. Pure Server Component.

type Props = {
  monthlyTotal: number;
  annualTotal: number;
  totalCount: number;
};

export function BurnRateCards({ monthlyTotal, annualTotal, totalCount }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Monthly Burn</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">
          ₹{monthlyTotal.toFixed(0)}
        </p>
        <p className="text-xs text-gray-400 mt-1">per month</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Annual Burn</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">
          ₹{annualTotal.toFixed(0)}
        </p>
        <p className="text-xs text-gray-400 mt-1">per year</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Active Subscriptions</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{totalCount}</p>
        <p className="text-xs text-gray-400 mt-1">services tracked</p>
      </div>
    </div>
  );
}