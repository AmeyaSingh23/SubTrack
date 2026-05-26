import Link from "next/link";
import { ServiceLogo } from "@/components/ui/service-logo";

type Subscription = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  nextBillingDate: Date;
  isTrial: boolean;
  cancelUrl?: string | null;
  isShared: boolean;
  splitCount: number;
};

type Props = {
  subscriptions: Subscription[];
};

function daysUntil(date: Date): number {
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function DaysBadge({ days }: { days: number }) {
  if (days < 0)
    return (
      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--danger-bg-strong)", color: "var(--danger-text)" }}>
        Overdue
      </span>
    );
  if (days === 0)
    return (
      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--warning-bg-strong)", color: "var(--warning-text)" }}>
        Today
      </span>
    );
  if (days === 1)
    return (
      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full opacity-80" style={{ backgroundColor: "var(--warning-bg)", color: "var(--warning-text)" }}>
        Tomorrow
      </span>
    );
  return (
    <span className="text-[11px] font-mono text-[var(--text-muted)]">
      {days}d
    </span>
  );
}

export function UpcomingBills({ subscriptions }: Props) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[var(--border)] to-transparent" />

      <p className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-widest mb-4">
        Due Soon
      </p>

      {subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-[var(--text-muted)] text-sm font-mono">All clear</p>
          <p className="text-[var(--text-faint)] text-xs font-mono mt-1">Nothing due in 7 days</p>
        </div>
      ) : (
        <ul className="space-y-1">
          {subscriptions.map((sub) => {
            const days = daysUntil(sub.nextBillingDate);
            return (
              <li key={sub.id}>
                <Link
                  href={`/subscriptions/${sub.id}`}
                  className="flex items-center justify-between py-2.5
                             border-b border-[var(--border-subtle)] last:border-0
                             hover:opacity-70 transition-opacity duration-150"
                >
                  <div className="flex items-center gap-3">
                    <ServiceLogo name={sub.name} size={28} className="shrink-0 rounded-md" />
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {sub.name}
                        {sub.isTrial && (
                          <span className="ml-2 text-[10px] font-mono bg-[var(--bg-card-hover)]
                                           text-[var(--text-muted)] px-1.5 py-0.5 rounded">
                            trial
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DaysBadge days={days} />
                    <div className="text-right">
                      <p className="text-sm font-mono font-semibold text-[var(--text-primary)]">
                        ₹{Math.round(sub.isShared ? sub.amount / sub.splitCount : sub.amount)}
                      </p>
                      {sub.isShared && (
                        <p className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-widest">
                          ÷{sub.splitCount} split
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
