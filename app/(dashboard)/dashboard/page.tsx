import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { BurnRateCards } from "@/components/dashboard/burn-rate-cards";
import { UpcomingBills } from "@/components/dashboard/upcoming-bills";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user!.id },
    select: { monthlyBudget: true },
  });

  const subscriptions = await db.subscription.findMany({
    where: { userId: session.user!.id, isActive: true },
    orderBy: { nextBillingDate: "asc" },
    select: {
      id: true,
      name: true,
      amount: true,
      currency: true,
      billingCycle: true,
      nextBillingDate: true,
      category: true,
      isTrial: true,
      isActive: true,
      cancelUrl: true,
      isShared: true,
      splitCount: true,
    },
  });

  const monthlyTotal = subscriptions.reduce((sum: number, sub: any) => {
    const share = sub.isShared ? sub.amount / sub.splitCount : sub.amount;
    if (sub.billingCycle === "monthly") return sum + share;
    if (sub.billingCycle === "yearly") return sum + share / 12;
    if (sub.billingCycle === "weekly") return sum + (share * 52) / 12;
    return sum;
  }, 0);

  const budget = user?.monthlyBudget ?? null;
  const budgetPercent = budget ? (monthlyTotal / budget) * 100 : null;

  const annualTotal = monthlyTotal * 12;

  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const upcoming = subscriptions.filter(
    (sub: any) => new Date(sub.nextBillingDate) <= sevenDaysFromNow
  );

  const byCategory = subscriptions.reduce(
    (acc: Record<string, number>, sub: any) => {
      const share = sub.isShared ? sub.amount / sub.splitCount : sub.amount;
      const monthlyAmount =
        sub.billingCycle === "yearly"
          ? share / 12
          : sub.billingCycle === "weekly"
            ? (share * 52) / 12
            : share;
      acc[sub.category] = (acc[sub.category] || 0) + monthlyAmount;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] font-sans selection:bg-[#c8ff00] selection:text-black">
      {/* Header - Editorial Style */}
      <header className="relative z-10 px-4 sm:px-6 md:px-12 pt-8 pb-12 border-b border-[var(--border-subtle)]">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-[0.3em]">
              SubTrack / Dashboard
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.04em] text-[var(--text-primary)]">
              {session.user?.name?.split(" ")[0] || "Your"}&apos;s
              <br />
              <span className="text-[var(--text-secondary)]">Burn Rate</span>
            </h1>
          </div>

          <Link
            href="/subscriptions/new"
            className="group relative flex items-center gap-3 bg-[var(--accent)] text-[var(--accent-text)] 
                       text-sm font-bold uppercase tracking-widest px-6 py-4
                       hover:bg-[var(--btn-invert-bg)] hover:text-[var(--btn-invert-text)] transition-all duration-300
                       before:absolute before:inset-0 before:border-2 before:border-[var(--accent)]
                       before:translate-x-1 before:translate-y-1 before:-z-10
                       hover:before:translate-x-2 hover:before:translate-y-2
                       before:transition-transform before:duration-300"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New
          </Link>
        </div>
      </header>

      {/* Budget Alert Banner */}
      {budgetPercent !== null && budgetPercent >= 80 && (
      <div className={`px-4 sm:px-6 md:px-12 py-3 border-b flex items-center justify-between
        ${budgetPercent >= 90
          ? "border-[var(--danger-border)] bg-[var(--danger-bg)]"
          : "border-[var(--warning-border)] bg-[var(--warning-bg)]"
        }`}>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: budgetPercent >= 90 ? "var(--danger-dot)" : "var(--warning-dot)" }} />
          <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: budgetPercent >= 90 ? "var(--danger-text)" : "var(--warning-text)" }}>
            {budgetPercent >= 100
              ? `Monthly budget exceeded by ₹${Math.round(monthlyTotal - budget!).toLocaleString("en-IN")}`
              : `${Math.round(budgetPercent)}% of monthly budget used — ₹${Math.round(budget! - monthlyTotal).toLocaleString("en-IN")} remaining`
            }
          </p>
        </div>
        <a
          href="/profile"
          className="font-mono text-[10px] uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: budgetPercent >= 90 ? "var(--danger-text)" : "var(--warning-text)" }}
        >
          Edit Budget →
        </a>
      </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 px-4 sm:px-6 md:px-12 py-12 space-y-16">
        {/* Hero: Burn Rate Numbers */}
        <BurnRateCards
          monthlyTotal={monthlyTotal}
          annualTotal={annualTotal}
          totalCount={subscriptions.length}
        />

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <UpcomingBills subscriptions={upcoming} />
          <CategoryBreakdown
            byCategory={byCategory}
            monthlyTotal={monthlyTotal}
          />
        </div>
      </div>

      {/* Footer Accent Line */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[var(--accent)] to-transparent opacity-20" />
    </main>
  );
}
