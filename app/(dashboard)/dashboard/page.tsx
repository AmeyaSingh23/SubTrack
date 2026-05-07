// app/(dashboard)/dashboard/page.tsx
// This is an ASYNC Server Component.
// "async" means we can use "await" directly in the component —
// Next.js will wait for the data before rendering the HTML.
// No useEffect, no loading spinners, no client-side fetch needed.
// The data arrives WITH the page. This is called Server-Side Rendering (SSR).

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

  // Direct database query — no API route needed!
  // This runs on the server, so it's safe to query the DB directly.
  // The user can never see or tamper with this code.
  const subscriptions = await db.subscription.findMany({
    where: {
      userId: session.user!.id,
      isActive: true,
    },
    orderBy: {
      nextBillingDate: "asc", // Soonest bills first
    },
  });

  // Calculate burn rates on the server before sending to client
  const monthlyTotal = subscriptions.reduce((sum: number, sub) => {
    if (sub.billingCycle === "monthly") return sum + sub.amount;
    if (sub.billingCycle === "yearly") return sum + sub.amount / 12;
    return sum;
  }, 0);

  const annualTotal = monthlyTotal * 12;

  // Subscriptions due in the next 7 days
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const upcoming = subscriptions.filter(
    (sub) => sub.nextBillingDate <= sevenDaysFromNow
  );

  // Group by category for breakdown
  const byCategory = subscriptions.reduce((acc, sub) => {
    acc[sub.category] = (acc[sub.category] || 0) + sub.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Hey, {session.user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-gray-500">
            Here&apos;s your subscription overview
          </p>
        </div>
        <Link href="/subscriptions/new" className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          +Add
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Burn Rate Cards */}
        <BurnRateCards
          monthlyTotal={monthlyTotal}
          annualTotal={annualTotal}
          totalCount={subscriptions.length}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Bills */}
          <UpcomingBills subscriptions={upcoming} />

          {/* Category Breakdown */}
          <CategoryBreakdown byCategory={byCategory} />
        </div>
      </div>
    </main>
  );
}