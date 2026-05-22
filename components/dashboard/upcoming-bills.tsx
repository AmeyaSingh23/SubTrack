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
      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-red-500/15 text-red-400">
        Overdue
      </span>
    );
  if (days === 0)
    return (
      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400">
        Today
      </span>
    );
  if (days === 1)
    return (
      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500/80">
        Tomorrow
      </span>
    );
  return (
    <span className="text-[11px] font-mono text-white/25">
      {days}d
    </span>
  );
}

export function UpcomingBills({ subscriptions }: Props) {
  return (
    <div className="bg-white/3 border border-white/7 rounded-xl p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <p className="text-[11px] font-mono text-white/30 uppercase tracking-widest mb-4">
        Due Soon
      </p>

      {subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-white/20 text-sm font-mono">All clear</p>
          <p className="text-white/10 text-xs font-mono mt-1">Nothing due in 7 days</p>
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
                             border-b border-white/4 last:border-0
                             hover:opacity-70 transition-opacity duration-150"
                >
                  <div className="flex items-center gap-3">
                    <ServiceLogo name={sub.name} size={28} className="shrink-0 rounded-md" />
                    <div>
                      <p className="text-sm font-medium text-white/80">
                        {sub.name}
                        {sub.isTrial && (
                          <span className="ml-2 text-[10px] font-mono bg-white/6
                                           text-white/30 px-1.5 py-0.5 rounded">
                            trial
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DaysBadge days={days} />
                    <p className="text-sm font-mono font-semibold text-white/70 w-16 text-right">
                      ₹{sub.amount}
                    </p>
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