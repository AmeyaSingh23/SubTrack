import { AddSubscriptionForm } from "@/components/subscriptions/add-subscription-form";

export default function NewSubscriptionPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <div className="max-w-lg mx-auto px-4 sm:px-8 py-12">
        <div className="mb-10">
          <p className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-[0.3em] mb-3">
            SubTrack / New
          </p>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-[var(--text-primary)]">
            Track a<br />
            <span className="text-[var(--text-muted)]">subscription.</span>
          </h1>
        </div>
        <AddSubscriptionForm />
      </div>
    </main>
  );
}
