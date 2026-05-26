import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AnalyticsCharts } from "@/components/analytics/analytics-charts";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const allSubscriptions = await db.subscription.findMany({
    where: { userId: session.user!.id },
    orderBy: { createdAt: "asc" },
  });

  const activeSubscriptions = allSubscriptions.filter((s: any) => s.isActive);

  // Active monthly burn — what you're paying RIGHT NOW
  // Uses your share (amount / splitCount) for shared subscriptions
  const activeByCategoryMonthly = activeSubscriptions.reduce(
    (acc: Record<string, number>, sub: any) => {
      const share = sub.isShared ? sub.amount / sub.splitCount : sub.amount;
      const monthly =
        sub.billingCycle === "yearly"
          ? share / 12
          : sub.billingCycle === "weekly"
          ? (share * 52) / 12
          : share;
      acc[sub.category] = (acc[sub.category] || 0) + monthly;
      return acc;
    },
    {}
  );

  const totalMonthly = Object.values(activeByCategoryMonthly).reduce(
    (a: number, b: number) => a + b,
    0
  );

  // Monthly trend — last 6 months (active subs only)
  const now = new Date();
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = date.toLocaleDateString("en-IN", {
      month: "short",
      year: "2-digit",
    });
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const total = activeSubscriptions
      .filter((sub: any) => new Date(sub.createdAt) <= endOfMonth)
      .reduce((sum: number, sub: any) => {
        const share = sub.isShared ? sub.amount / sub.splitCount : sub.amount;
        const monthly =
          sub.billingCycle === "yearly"
            ? share / 12
            : sub.billingCycle === "weekly"
            ? (share * 52) / 12
            : share;
        return sum + monthly;
      }, 0);
    return { month: label, total: Math.round(total) };
  });

  // Top active subscriptions by monthly cost
  const topSubs = [...activeSubscriptions]
    .map((sub: any) => {
      const share = sub.isShared ? sub.amount / sub.splitCount : sub.amount;
      return {
        name: sub.name,
        monthly:
          sub.billingCycle === "yearly"
            ? share / 12
            : sub.billingCycle === "weekly"
            ? (share * 52) / 12
            : share,
        billingCycle: sub.billingCycle,
        amount: share,
      };
    })
    .sort((a, b) => b.monthly - a.monthly)
    .slice(0, 5);

  // Historical spend — ALL subs ever, calculate total ever paid
  // Uses your share for shared subscriptions
  const historicalByCategory = allSubscriptions.reduce(
    (acc: Record<string, number>, sub: any) => {
      const start = new Date(sub.createdAt);
      const end = sub.isActive ? now : new Date(sub.updatedAt);
      const monthsActive = Math.max(
        1,
        Math.round(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
        )
      );
      const share = sub.isShared ? sub.amount / sub.splitCount : sub.amount;
      const monthly =
        sub.billingCycle === "yearly"
          ? share / 12
          : sub.billingCycle === "weekly"
          ? (share * 52) / 12
          : share;
      acc[sub.category] = (acc[sub.category] || 0) + monthly * monthsActive;
      return acc;
    },
    {}
  );

  const totalHistorical = Object.values(historicalByCategory).reduce(
    (a: number, b: number) => a + b,
    0
  );

  // Cancelled subs list for historical section
  const cancelledSubs = allSubscriptions
    .filter((s: any) => !s.isActive)
    .map((sub: any) => {
      const start = new Date(sub.createdAt);
      const end = new Date(sub.updatedAt);
      const monthsActive = Math.max(
        1,
        Math.round(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
        )
      );
      const share = sub.isShared ? sub.amount / sub.splitCount : sub.amount;
      const monthly =
        sub.billingCycle === "yearly"
          ? share / 12
          : sub.billingCycle === "weekly"
          ? (share * 52) / 12
          : share;
      return {
        name: sub.name,
        category: sub.category,
        monthsActive,
        totalSpent: Math.round(monthly * monthsActive),
      };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <div className="px-8 pt-8 pb-6 border-b border-[var(--border-subtle)]">
        <p className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-[0.4em] mb-1">
          SubTrack / Analytics
        </p>
        <h1 className="text-3xl font-black tracking-[-0.04em]">
          Spending Analytics
        </h1>
      </div>

      <AnalyticsCharts
        byCategory={activeByCategoryMonthly}
        monthlyTrend={monthlyTrend}
        topSubs={topSubs}
        totalMonthly={totalMonthly}
        historicalByCategory={historicalByCategory}
        totalHistorical={totalHistorical}
        cancelledSubs={cancelledSubs}
      />
    </main>
  );
}
