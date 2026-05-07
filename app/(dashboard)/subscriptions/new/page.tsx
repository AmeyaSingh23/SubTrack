// app/(dashboard)/subscriptions/new/page.tsx
// This page is a Server Component that renders the form shell.
// The form itself is a Client Component because it needs interactivity
// (showing/hiding the trial date field based on checkbox state).

import { AddSubscriptionForm } from "@/components/subscriptions/add-subscription-form";

export default function NewSubscriptionPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Add Subscription
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track a new recurring charge
          </p>
        </div>

        <AddSubscriptionForm />
      </div>
    </main>
  );
}