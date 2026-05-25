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
  });

  const monthlyTotal = subscriptions.reduce((sum: number, sub: any) => {
    if (sub.billingCycle === "monthly") return sum + sub.amount;
    if (sub.billingCycle === "yearly") return sum + sub.amount / 12;
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
      const monthlyAmount =
        sub.billingCycle === "yearly"
          ? sub.amount / 12
          : sub.billingCycle === "weekly"
            ? (sub.amount * 52) / 12
            : sub.amount;
      acc[sub.category] = (acc[sub.category] || 0) + monthlyAmount;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#c8ff00] selection:text-black">
      {/* Header - Editorial Style */}
      <header className="relative z-10 px-4 sm:px-6 md:px-12 pt-8 pb-12 border-b border-white/5">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="font-mono text-[10px] text-[#c8ff00] uppercase tracking-[0.3em]">
              SubTrack / Dashboard
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.04em] text-white">
              {session.user?.name?.split(" ")[0] || "Your"}&apos;s
              <br />
              <span className="text-white/40">Burn Rate</span>
            </h1>
          </div>

          <Link
            href="/subscriptions/new"
            className="group relative flex items-center gap-3 bg-[#c8ff00] text-black 
                       text-sm font-bold uppercase tracking-widest px-6 py-4
                       hover:bg-white transition-all duration-300
                       before:absolute before:inset-0 before:border-2 before:border-[#c8ff00]
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
        ${budgetPercent >= 100
          ? "border-red-500/20 bg-red-500/5"
          : "border-amber-500/20 bg-amber-500/5"
        }`}>
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-1.5 rounded-full ${budgetPercent >= 100 ? "bg-red-400" : "bg-amber-400"}`} />
          <p className={`font-mono text-[11px] uppercase tracking-widest
            ${budgetPercent >= 100 ? "text-red-400" : "text-amber-400"}`}>
            {budgetPercent >= 100
              ? `Monthly budget exceeded by ₹${Math.round(monthlyTotal - budget!).toLocaleString("en-IN")}`
              : `${Math.round(budgetPercent)}% of monthly budget used — ₹${Math.round(budget! - monthlyTotal).toLocaleString("en-IN")} remaining`
            }
          </p>
        </div>
        <a
          href="/profile"
          className={`font-mono text-[10px] uppercase tracking-widest
          ${budgetPercent >= 100 ? "text-red-400/60 hover:text-red-400" : "text-amber-400/60 hover:text-amber-400"}
          transition-colors`}
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
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#c8ff00] to-transparent opacity-20" />
    </main>
  );
}
