"use client";
// Needs "use client" because filters are interactive state

import { useState } from "react";
import Link from "next/link";
import { ServiceLogo } from "@/components/ui/service-logo";
import { exportToCSV } from "@/lib/export-csv";

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
  cancelUrl: string | null;
  createdAt: Date;
  isShared: boolean;
  splitCount: number;
};

type Filter = "all" | "active" | "cancelled" | "trials" | "overdue";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "cancelled", label: "Cancelled" },
  { key: "trials", label: "Free Trials" },
  { key: "overdue", label: "Overdue" },
];

function daysUntil(date: Date): number {
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function StatusBadge({ sub }: { sub: Subscription }) {
  if (!sub.isActive)
    return (
      <span className="font-mono text-[10px] px-2 py-0.5 border border-[var(--border)] text-[var(--text-muted)] uppercase tracking-widest">
        Cancelled
      </span>
    );
  if (sub.isTrial)
    return (
      <span className="font-mono text-[10px] px-2 py-0.5 border border-[var(--accent)]/30 text-[var(--accent)] uppercase tracking-widest">
        Trial
      </span>
    );
  const days = daysUntil(sub.nextBillingDate);
  if (days < 0)
    return (
      <span className="font-mono text-[10px] px-2 py-0.5 border uppercase tracking-widest" style={{ borderColor: "var(--danger-border)", color: "var(--danger-text)" }}>
        Overdue
      </span>
    );
  if (days <= 2)
    return (
      <span className="font-mono text-[10px] px-2 py-0.5 border uppercase tracking-widest" style={{ borderColor: "var(--warning-border)", color: "var(--warning-text)" }}>
        Due Soon
      </span>
    );
  return (
    <span className="font-mono text-[10px] px-2 py-0.5 border border-[var(--border)] text-[var(--text-muted)] uppercase tracking-widest">
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
    return true;
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
      <aside className="w-48 shrink-0 border-r border-[var(--border-subtle)] px-4 py-6">
        <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-widest mb-4">
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
                    ? "bg-[var(--bg-card-hover)] text-[var(--accent)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card)]"
                  }`}
              >
                <span>{f.label}</span>
                <span className={`text-[10px] ${filter === f.key ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}>
                  {counts[f.key]}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
          <button
            onClick={() => exportToCSV(subscriptions)}
            className="w-full font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest
                       border border-[var(--border-subtle)] px-3 py-2
                       hover:border-[var(--accent)]/30 hover:text-[var(--accent)]
                       transition-colors duration-200 text-left"
          >
            Export CSV ↓
          </button>
        </div>
      </aside>

      {/* Subscriptions list */}
      <div className="flex-1 px-8 py-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="font-mono text-[var(--text-muted)] text-sm uppercase tracking-widest">
              Nothing here
            </p>
            <Link
              href="/subscriptions/new"
              className="mt-4 font-mono text-[11px] text-[var(--accent)] uppercase tracking-widest hover:text-[var(--text-primary)] transition-colors"
            >
              + Add a subscription →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border-subtle)]">
            {filtered.map((sub) => {
              const days = daysUntil(sub.nextBillingDate);
              const displayAmount = sub.isShared
                ? Math.round(sub.amount / sub.splitCount)
                : sub.amount;
              return (
                <li key={sub.id}>
                  <Link
                    href={`/subscriptions/${sub.id}`}
                    className="flex items-center gap-4 py-4 group
                               hover:bg-[var(--bg-card)] -mx-4 px-4 transition-colors duration-150"
                  >
                    {/* Logo */}
                    <ServiceLogo name={sub.name} size={32} className="shrink-0" />

                    {/* Name + category */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--text-primary)] transition-colors truncate">
                          {sub.name}
                        </p>
                        {sub.isShared && (
                          <span className="font-mono text-[9px] text-[var(--text-muted)] border border-[var(--border)]
                                           px-1.5 py-0.5 uppercase tracking-widest shrink-0">
                            ÷{sub.splitCount}
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-0.5">
                        {sub.category} · {sub.billingCycle}
                      </p>
                    </div>

                    {/* Next billing date */}
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                        {days < 0 ? "Overdue" : days === 0 ? "Today" : `${days}d`}
                      </p>
                      <p className="font-mono text-[10px] text-[var(--text-faint)] mt-0.5">
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
                    <div className="shrink-0 w-20 text-right">
                      <p className="font-mono font-bold text-sm text-[var(--text-primary)]
                                    group-hover:text-[var(--text-primary)] transition-colors">
                        ₹{displayAmount}
                      </p>
                      {sub.isShared && (
                        <p className="font-mono text-[9px] text-[var(--text-muted)]">
                          your share
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    <span className="font-mono text-[var(--text-faint)] group-hover:text-[var(--accent)] transition-colors text-xs">
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
