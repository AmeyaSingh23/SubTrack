import { AddSubscriptionForm } from "@/components/subscriptions/add-subscription-form";

export default function NewSubscriptionPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-lg mx-auto px-4 sm:px-8 py-12">
        <div className="mb-10">
          <p className="font-mono text-[10px] text-[#c8ff00] uppercase tracking-[0.3em] mb-3">
            SubTrack / New
          </p>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-white">
            Track a<br />
            <span className="text-white/30">subscription.</span>
          </h1>
        </div>
        <AddSubscriptionForm />
      </div>
    </main>
  );
}