// [id] is a dynamic segment — Next.js passes it as a prop called "params"
// So /subscriptions/abc123 → params.id === "abc123"
// This is a Server Component — it fetches the subscription and passes
// it to a Client Component form for editing.

import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SubscriptionDetailForm } from "@/components/subscriptions/subscription-detail-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SubscriptionDetailPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;

  // Fetch this specific subscription
  // Also verify it belongs to the logged-in user (security)
  const subscription = await db.subscription.findFirst({
    where: {
      id,
      userId: session.user!.id,
    },
  });

  // If not found or doesn't belong to user — show 404
  if (!subscription) notFound();

  return (
    <div className="text-white">
      <div className="max-w-xl mx-auto px-4 sm:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-[10px] text-[#c8ff00] uppercase tracking-[0.4em] mb-3">
            SubTrack / Subscriptions / {subscription.name}
          </p>
          <h1 className="text-4xl font-black tracking-[-0.04em]">
            {subscription.name}
            <br />
            <span className="text-white/20">Details</span>
          </h1>
        </div>

        <SubscriptionDetailForm subscription={subscription} />
      </div>
    </div>
  );
}