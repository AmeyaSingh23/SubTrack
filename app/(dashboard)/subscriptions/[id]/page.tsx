// [id] is a dynamic segment — Next.js passes it as a prop called "params"
// So /subscriptions/abc123 → params.id === "abc123"
// This is a Server Component — it fetches the subscription and passes
// it to a Client Component form for editing.

import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SubscriptionDetailForm } from "@/components/subscriptions/subscription-detail-form";
import { ServiceLogo } from "@/components/ui/service-logo";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ renewed?: string }>;
};

export default async function SubscriptionDetailPage({ params, searchParams }: Props) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;
  const { renewed } = await searchParams;

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
    <div className="text-[var(--text-primary)]">
      <div className="max-w-xl mx-auto px-4 sm:px-8 py-12">
        {/* Renewed banner from email link */}
        {renewed === "true" && (
          <div className="mb-6 border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-4 py-3">
            <p className="font-mono text-[11px] text-[var(--accent)] uppercase tracking-widest">
              Billing date advanced by one cycle. If you changed plans, update the details below.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-[0.4em] mb-3">
            SubTrack / Subscriptions / {subscription.name}
          </p>
          <div className="flex items-center gap-5">
            <ServiceLogo name={subscription.name} size={64} className="shrink-0 rounded-xl" />
            <h1 className="text-4xl font-black tracking-[-0.04em]">
              {subscription.name}
              <br />
              <span className="text-[var(--text-muted)]">Details</span>
            </h1>
          </div>
        </div>

        <SubscriptionDetailForm subscription={subscription} />
      </div>
    </div>
  );
}
