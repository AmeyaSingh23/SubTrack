type Props = {
  monthlyTotal: number;
  annualTotal: number;
  totalCount: number;
};

export function BurnRateCards({ monthlyTotal, annualTotal, totalCount }: Props) {
  const cards = [
    {
      label: "Monthly Burn",
      value: `₹${monthlyTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      sub: "per month",
      accent: false,
    },
    {
      label: "Annual Burn",
      value: `₹${annualTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      sub: "per year",
      accent: false,
    },
    {
      label: "Subscriptions",
      value: totalCount.toString(),
      sub: "active services",
      accent: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="relative bg-white/3 border border-white/7 
                     rounded-xl p-5 overflow-hidden group
                     hover:border-white/12 transition-colors duration-300"
        >
          {/* Subtle top highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

          <p className="text-[11px] font-mono text-white/30 uppercase tracking-widest mb-3">
            {card.label}
          </p>
          <p className="text-2xl sm:text-3xl font-mono font-semibold text-white tracking-tight">
            {card.value}
          </p>
          <p className="text-[11px] text-white/20 mt-1.5 font-mono">
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  );
}