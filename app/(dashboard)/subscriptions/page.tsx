// app/(dashboard)/subscriptions/page.tsx
// This is the "all subscriptions" page.
// It fetches all subs server-side and passes them to a client
// component that handles the filter sidebar interactivity.

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SubscriptionsList } from "@/components/subscriptions/subscriptions-list";
import Link from "next/link";

export default async function SubscriptionsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const subscriptions = await db.subscription.findMany({
    where: { userId: session.user!.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="flex items-end justify-between px-8 pt-8 pb-6 border-b border-white/6">
        <div>
          <p className="font-mono text-[10px] text-[#c8ff00] uppercase tracking-[0.4em] mb-1">
            SubTrack / Subscriptions
          </p>
          <h1 className="text-3xl font-black tracking-[-0.04em]">
            All Subscriptions
          </h1>
        </div>
        <Link
          href="/subscriptions/new"
          className="relative flex items-center gap-2 bg-[#c8ff00] text-black
                     font-bold text-xs uppercase tracking-widest px-5 py-3
                     hover:bg-white transition-colors duration-200
                     before:absolute before:inset-0 before:border-2 before:border-[#c8ff00]/30
                     before:translate-x-1 before:translate-y-1 before:-z-10
                     before:transition-transform before:duration-300
                     hover:before:translate-x-2 hover:before:translate-y-2"
        >
          + Add New
        </Link>
      </div>

      {/* List with filter sidebar */}
      <SubscriptionsList subscriptions={subscriptions} />
    </main>
  );
}