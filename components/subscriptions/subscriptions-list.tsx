"use client";
// Needs "use client" because filters are interactive state

import { useState } from "react";
import Link from "next/link";

type Subscription = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: string;
  nextBillingDate: Date;
  category: string;
  isTrial: boolean;
  isActive: boolean;
};

type Filter = "all" | "active" | "cancelled" | "trials" | "overdue";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "cancelled", label: "Cancelled" },
  { key: "trials", label: "Free Trials" },
  { key: "overdue", label: "Overdue"},
];

function daysUntil(date: Date): number {
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function StatusBadge({ sub }: { sub: Subscription }) {
  if (!sub.isActive)
    return (
      <span className="font-mono text-[10px] px-2 py-0.5 border border-white/10 text-white/20 uppercase tracking-widest">
        Cancelled
      </span>
    );
  if (sub.isTrial)
    return (
      <span className="font-mono text-[10px] px-2 py-0.5 border border-[#c8ff00]/30 text-[#c8ff00] uppercase tracking-widest">
        Trial
      </span>
    );
  const days = daysUntil(sub.nextBillingDate);
  if (days < 0)
    return (
      <span className="font-mono text-[10px] px-2 py-0.5 border border-red-500/30 text-red-400 uppercase tracking-widest">
        Overdue
      </span>
    );
  if (days <= 2)
    return (
      <span className="font-mono text-[10px] px-2 py-0.5 border border-amber-500/30 text-amber-400 uppercase tracking-widest">
        Due Soon
      </span>
    );
  return (
    <span className="font-mono text-[10px] px-2 py-0.5 border border-white/10 text-white/30 uppercase tracking-widest">
      Active
    </span>
  );
}

export function SubscriptionsList({
  subscriptions,
}: {
  subscriptions: Subscription[];
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = subscriptions.filter((sub) => {
    if (filter === "active") return sub.isActive && !sub.isTrial;
    if (filter === "cancelled") return !sub.isActive;
    if (filter === "trials") return sub.isTrial;
    if (filter === "overdue") return daysUntil(sub.nextBillingDate) < 0 && sub.isActive;
    return true; // "all"
  });

  const counts = {
    all: subscriptions.length,
    active: subscriptions.filter((s) => s.isActive && !s.isTrial).length,
    cancelled: subscriptions.filter((s) => !s.isActive).length,
    trials: subscriptions.filter((s) => s.isTrial).length,
    overdue: subscriptions.filter((s) => daysUntil(s.nextBillingDate) < 0 && s.isActive).length,
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      {/* Filter sidebar */}
      <aside className="w-48 shrink-0 border-r border-white/6 px-4 py-6">
        <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest mb-4">
          Filter
        </p>
        <ul className="space-y-0.5">
          {FILTERS.map((f) => (
            <li key={f.key}>
              <button
                onClick={() => setFilter(f.key)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left
                           font-mono text-[11px] uppercase tracking-widest transition-colors
                           ${filter === f.key
                    ? "bg-white/6 text-[#c8ff00]"
                    : "text-white/30 hover:text-white/60 hover:bg-white/4"
                  }`}
              >
                <span>{f.label}</span>
                <span className={`text-[10px] ${filter === f.key ? "text-[#c8ff00]" : "text-white/20"}`}>
                  {counts[f.key]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Subscriptions list */}
      <div className="flex-1 px-8 py-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="font-mono text-white/20 text-sm uppercase tracking-widest">
              Nothing here
            </p>
            <Link
              href="/subscriptions/new"
              className="mt-4 font-mono text-[11px] text-[#c8ff00] uppercase tracking-widest hover:text-white transition-colors"
            >
              + Add a subscription →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-white/6">
            {filtered.map((sub) => {
              const days = daysUntil(sub.nextBillingDate);
              return (
                // Entire row is a link to the detail page
                <li key={sub.id}>
                  <Link
                    href={`/subscriptions/${sub.id}`}
                    className="flex items-center gap-4 py-4 group
                               hover:bg-white/2 -mx-4 px-4 transition-colors duration-150"
                  >
                    {/* Initial avatar */}
                    <div className="w-8 h-8 flex items-center justify-center
                                    border border-white/10 font-mono text-xs
                                    text-white/40 group-hover:border-[#c8ff00]/30
                                    group-hover:text-[#c8ff00] transition-colors shrink-0">
                      {sub.name[0].toUpperCase()}
                    </div>

                    {/* Name + category */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-white/80 group-hover:text-white transition-colors truncate">
                        {sub.name}
                      </p>
                      <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mt-0.5">
                        {sub.category} · {sub.billingCycle}
                      </p>
                    </div>

                    {/* Next billing date */}
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
                        {days < 0 ? "Overdue" : days === 0 ? "Today" : `${days}d`}
                      </p>
                      <p className="font-mono text-[10px] text-white/10 mt-0.5">
                        {new Date(sub.nextBillingDate).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short"
                        })}
                      </p>
                    </div>

                    {/* Status badge */}
                    <div className="shrink-0 hidden md:block">
                      <StatusBadge sub={sub} />
                    </div>

                    {/* Amount */}
                    <p className="font-mono font-bold text-sm text-white/70
                                  group-hover:text-white transition-colors shrink-0 w-20 text-right">
                      ₹{sub.amount}
                    </p>

                    {/* Arrow */}
                    <span className="font-mono text-white/10 group-hover:text-[#c8ff00] transition-colors text-xs">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}