import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AnalyticsCharts } from "@/components/analytics/analytics-charts";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const subscriptions = await db.subscription.findMany({
    where: { userId: session.user!.id },
    orderBy: { createdAt: "asc" },
  });

  const byCategory = subscriptions
    .filter((s: any) => s.isActive)
    .reduce((acc: Record<string, number>, sub: any) => {
      const monthly =
        sub.billingCycle === "yearly"
          ? sub.amount / 12
          : sub.billingCycle === "weekly"
          ? (sub.amount * 52) / 12
          : sub.amount;
      acc[sub.category] = (acc[sub.category] || 0) + monthly;
      return acc;
    }, {});

  const now = new Date();
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    const total = subscriptions
      .filter((sub: any) => {
        const created = new Date(sub.createdAt);
        return created <= new Date(date.getFullYear(), date.getMonth() + 1, 0);
      })
      .reduce((sum: number, sub: any) => {
        const monthly =
          sub.billingCycle === "yearly"
            ? sub.amount / 12
            : sub.billingCycle === "weekly"
            ? (sub.amount * 52) / 12
            : sub.amount;
        return sum + monthly;
      }, 0);
    return { month: label, total: Math.round(total) };
  });

  const topSubs = [...subscriptions]
    .filter((s: any) => s.isActive)
    .map((sub: any) => ({
      name: sub.name,
      monthly:
        sub.billingCycle === "yearly"
          ? sub.amount / 12
          : sub.billingCycle === "weekly"
          ? (sub.amount * 52) / 12
          : sub.amount,
      billingCycle: sub.billingCycle,
      amount: sub.amount,
    }))
    .sort((a, b) => b.monthly - a.monthly)
    .slice(0, 5);

  const totalMonthly = Object.values(byCategory).reduce(
    (a: number, b: number) => a + b,
    0
  );

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="px-8 pt-8 pb-6 border-b border-white/6">
        <p className="font-mono text-[10px] text-[#c8ff00] uppercase tracking-[0.4em] mb-1">
          SubTrack / Analytics
        </p>
        <h1 className="text-3xl font-black tracking-[-0.04em]">
          Spending Analytics
        </h1>
      </div>

      <AnalyticsCharts
        byCategory={byCategory}
        monthlyTrend={monthlyTrend}
        topSubs={topSubs}
        totalMonthly={totalMonthly}
      />
    </main>
  );
}