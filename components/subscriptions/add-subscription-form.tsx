"use client";
import { useActionState, useState } from "react";
import { createSubscription } from "@/app/actions/subscriptions";

const CATEGORIES = ["Streaming", "Music", "Work", "Utilities", "Health", "Other"];
const CURRENCIES = ["INR", "USD", "EUR", "GBP"];

function FieldLabel({ number, label, optional }: { number: string; label: string; optional?: boolean }) {
  return (
    <div className="flex items-baseline justify-between mb-2">
      <label className="flex items-baseline gap-2">
        <span className="font-mono text-[10px] text-[#c8ff00] tracking-widest">{number}</span>
        <span className="font-mono text-[11px] text-white/40 uppercase tracking-widest">{label}</span>
      </label>
      {optional && (
        <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">Optional</span>
      )}
    </div>
  );
}

const inputClass = `
  w-full bg-transparent border border-white/[0.08] text-white font-mono text-sm
  px-4 py-3 outline-none
  focus:border-[#c8ff00]/50 focus:bg-[#c8ff00]/[0.02]
  placeholder:text-white/20
  transition-all duration-200
`;

const selectClass = `
  w-full bg-[#0a0a0a] border border-white/[0.08] text-white font-mono text-sm
  px-4 py-3 outline-none
  focus:border-[#c8ff00]/50
  transition-all duration-200
  appearance-none cursor-pointer
`;

export function AddSubscriptionForm() {
  const [isTrial, setIsTrial] = useState(false);
  const [, formAction, isPending] = useActionState(createSubscription, null);

  return (
    <form action={formAction} className="space-y-0">

      {/* Divider line */}
      <div className="border-t border-white/6 pt-8 space-y-8">

        {/* 01 — Name */}
        <div>
          <FieldLabel number="01" label="Service Name" />
          <input
            name="name"
            type="text"
            required
            placeholder="e.g. Netflix"
            className={inputClass}
          />
        </div>

        {/* 02 — Amount + Currency */}
        <div>
          <FieldLabel number="02" label="Amount" />
          <div className="grid grid-cols-3 gap-0">
            <input
              name="amount"
              type="number"
              required
              min="0"
              step="any"
              placeholder="649"
              className={`${inputClass} col-span-2 border-r-0`}
            />
            <select name="currency" defaultValue="INR" className={selectClass}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c} className="bg-[#0a0a0a]">{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 03 — Billing Cycle */}
        <div>
          <FieldLabel number="03" label="Billing Cycle" />
          <div className="grid grid-cols-3 gap-0">
            {["monthly", "yearly", "weekly"].map((cycle) => (
              <label
                key={cycle}
                className="relative flex items-center justify-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="billingCycle"
                  value={cycle}
                  required
                  className="peer sr-only"
                  defaultChecked={cycle === "monthly"}
                />
                <span className="w-full text-center font-mono text-[11px] uppercase tracking-widest
                                 border border-white/8 py-3 text-white/30
                                 peer-checked:border-[#c8ff00]/50 peer-checked:text-[#c8ff00] peer-checked:bg-[#c8ff00]/4
                                 transition-all duration-200 -ml-px first:ml-0">
                  {cycle}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 04 — Next Billing Date */}
        <div>
          <FieldLabel number="04" label="Next Billing Date" />
          <input
            name="nextBillingDate"
            type="date"
            required
            className={inputClass}
          />
        </div>

        {/* 05 — Category */}
        <div>
          <FieldLabel number="05" label="Category" />
          <div className="grid grid-cols-3 gap-0">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="relative flex items-center justify-center cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  required
                  className="peer sr-only"
                />
                <span className="w-full text-center font-mono text-[11px] uppercase tracking-widest
                                 border border-white/8 py-3 text-white/30
                                 peer-checked:border-[#c8ff00]/50 peer-checked:text-[#c8ff00] peer-checked:bg-[#c8ff00]/4
                                 transition-all duration-200 -ml-px first:ml-0">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 06 — Cancel URL */}
        <div>
          <FieldLabel number="06" label="Cancellation URL" optional />
          <input
            name="cancelUrl"
            type="url"
            placeholder="https://netflix.com/cancel"
            className={inputClass}
          />
        </div>

        {/* 07 — Trial */}
        <div>
          <FieldLabel number="07" label="Free Trial?" />
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className="relative">
              <input
                name="isTrial"
                type="checkbox"
                checked={isTrial}
                onChange={(e) => setIsTrial(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-10 h-5 border border-white/8 peer-checked:border-[#c8ff00]/50 
                              peer-checked:bg-[#c8ff00]/10 transition-all duration-200" />
              <div className="absolute top-1 left-1 w-3 h-3 bg-white/20 
                              peer-checked:bg-[#c8ff00] peer-checked:translate-x-5
                              transition-all duration-200" />
            </div>
            <span className="font-mono text-[11px] text-white/30 uppercase tracking-widest 
                             group-hover:text-white/50 transition-colors">
              {isTrial ? "Yes — this is a trial" : "No"}
            </span>
          </label>

          {isTrial && (
            <div className="mt-4">
              <FieldLabel number="07b" label="Trial End Date" />
              <input
                name="trialEndDate"
                type="date"
                className={inputClass}
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-white/6">
          <button
            type="submit"
            disabled={isPending}
            className="group relative w-full flex items-center justify-center gap-3
                       bg-white text-black font-bold text-sm uppercase tracking-widest
                       px-6 py-4 transition-all duration-300
                       hover:bg-[#c8ff00] disabled:opacity-40 disabled:cursor-not-allowed
                       before:absolute before:inset-0 before:border-2 before:border-white/20
                       before:translate-x-1 before:translate-y-1 before:-z-10
                       hover:before:border-[#c8ff00]/40
                       before:transition-all before:duration-300"
          >
            {isPending ? "Saving..." : "Track Subscription →"}
          </button>
        </div>
      </div>
    </form>
  );
}