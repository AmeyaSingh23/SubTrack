// components/subscriptions/add-subscription-form.tsx
"use client";
// We need "use client" here because:
// 1. We use useState to show/hide the trial date field
// 2. We use useActionState to track form submission status

import { useActionState, useState } from "react";
import { createSubscription } from "@/app/actions/subscriptions";

const CATEGORIES = ["Streaming", "Music", "Work", "Utilities", "Health", "Other"];
const CURRENCIES = ["INR", "USD", "EUR", "GBP"];

export function AddSubscriptionForm() {
  const [isTrial, setIsTrial] = useState(false);

  // useActionState is React 19's hook for handling Server Action state.
  // It gives us:
  // - "state": the return value of our action (we'll use for errors later)
  // - "formAction": a version of our action wired to the form
  // - "isPending": true while the server is processing the submission
  const [, formAction, isPending] = useActionState(createSubscription, null);

  return (
    <form
      action={formAction}
      className="bg-white rounded-xl border border-gray-200 p-6 space-y-5"
    >
      {/* Service Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Name *
        </label>
        <input
          name="name"
          type="text"
          required
          placeholder="e.g. Netflix, Spotify"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 
                     text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {/* Amount + Currency */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount *
          </label>
          <input
            name="amount"
            type="number"
            required
            min="0"
            step="0.01"
            placeholder="649"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 
                       text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            name="currency"
            defaultValue="INR"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 
                       text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Billing Cycle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Billing Cycle *
        </label>
        <select
          name="billingCycle"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 
                     text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="">Select cycle</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      {/* Next Billing Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Next Billing Date *
        </label>
        <input
          name="nextBillingDate"
          type="date"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 
                     text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <select
          name="category"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 
                     text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="">Select category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Cancellation URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cancellation URL
          <span className="text-gray-400 font-normal ml-1">(optional)</span>
        </label>
        <input
          name="cancelUrl"
          type="url"
          placeholder="https://netflix.com/cancel"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 
                     text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {/* Trial Checkbox */}
      <div className="flex items-center gap-2">
        <input
          name="isTrial"
          type="checkbox"
          id="isTrial"
          checked={isTrial}
          onChange={(e) => setIsTrial(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="isTrial" className="text-sm text-gray-700">
          This is a free trial
        </label>
      </div>

      {/* Trial End Date - only shown when trial is checked */}
      {isTrial && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trial End Date
          </label>
          <input
            name="trialEndDate"
            type="date"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 
                       text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gray-900 text-white rounded-lg px-4 py-2.5 
                   text-sm font-medium hover:bg-gray-700 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Saving..." : "Add Subscription"}
      </button>
    </form>
  );
}