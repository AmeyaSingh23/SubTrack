"use client";

import { useActionState, useState, useTransition } from "react";
import {
  updateSubscription,
  deleteSubscription,
} from "@/app/actions/subscriptions";

const CATEGORIES = [
  "Streaming",
  "Music",
  "Work",
  "Utilities",
  "Health",
  "Other",
];

const CURRENCIES = ["INR", "USD", "EUR", "GBP"];

type Subscription = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: string;
  nextBillingDate: Date;
  category: string;
  cancelUrl: string | null;
  isTrial: boolean;
  trialEndDate: Date | null;
  isActive: boolean;
  isShared: boolean;
  splitCount: number;
};

function FieldLabel({
  number,
  label,
  optional,
}: {
  number: string;
  label: string;
  optional?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between mb-2">
      <label className="flex items-baseline gap-2">
        <span className="font-mono text-[10px] text-[var(--accent)] tracking-widest">
          {number}
        </span>
        <span className="font-mono text-[11px] text-[var(--text-secondary)] uppercase tracking-widest">
          {label}
        </span>
      </label>
      {optional && (
        <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-widest">
          Optional
        </span>
      )}
    </div>
  );
}

const inputClass = `
  w-full bg-transparent border border-[var(--border)] text-[var(--text-primary)] font-mono text-sm
  px-4 py-3 outline-none
  focus:border-[var(--accent)]/50 focus:bg-[var(--accent)]/2
  placeholder:text-[var(--text-muted)]
  transition-all duration-200
`;

const selectClass = `
  w-full bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] font-mono text-sm
  px-4 py-3 outline-none
  focus:border-[var(--accent)]/50
  transition-all duration-200
  appearance-none cursor-pointer
`;

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export function SubscriptionDetailForm({
  subscription,
}: {
  subscription: Subscription;
}) {
  const [isTrial, setIsTrial] = useState(subscription.isTrial);
  const [isShared, setIsShared] = useState(subscription.isShared);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isUnlocked, setIsUnlocked] = useState(false);

  const updateWithId = updateSubscription.bind(null, subscription.id);
  const [, formAction, isPending] = useActionState(updateWithId, null);

  function handleDelete() {
    startDeleteTransition(async () => {
      await deleteSubscription(subscription.id);
    });
  }

  // Your share of the cost
  const yourShare = subscription.isShared
    ? Math.round(subscription.amount / subscription.splitCount)
    : subscription.amount;

  return (
    <div className="space-y-8">
      {/* Cancelled Banner */}
      {!subscription.isActive && !isUnlocked && (
        <div className="border border-[var(--danger-border)] bg-[var(--danger-bg)] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "var(--danger-text)" }}>
              This subscription is cancelled
            </p>
            <p className="font-mono text-[10px] text-[var(--text-muted)] mt-1">
              To reactivate this subscription, unlock the details below, edit/verify the fields, and save changes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsUnlocked(true)}
            className="shrink-0 font-mono text-xs uppercase tracking-widest px-6 py-3 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all duration-300"
          >
            Reactivate
          </button>
        </div>
      )}

      {!subscription.isActive && isUnlocked && (
        <div className="border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4">
          <p className="font-mono text-[11px] text-[var(--accent)] uppercase tracking-widest">
            Reactivation Mode
          </p>
          <p className="font-mono text-[10px] text-[var(--text-muted)] mt-1">
            The form is now unlocked. Update the billing date and details, then click <strong>Save Changes</strong> below to reactivate this subscription.
          </p>
        </div>
      )}

      {/* Shared subscription info banner */}
      {subscription.isShared && (
        <div className="border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 flex items-center justify-between">
          <p className="font-mono text-[11px] text-[var(--text-secondary)] uppercase tracking-widest">
            Shared ÷ {subscription.splitCount} — your share
          </p>
          <p className="font-mono text-sm font-bold text-[var(--accent)]">
            ₹{yourShare} / {subscription.billingCycle === "yearly" ? "yr" : subscription.billingCycle === "weekly" ? "wk" : "mo"}
          </p>
        </div>
      )}

      <form
        action={formAction}
        className={`border-t border-[var(--border-subtle)] pt-8 space-y-8 ${
          !subscription.isActive && !isUnlocked ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {/* 01 Name */}
        <div>
          <FieldLabel number="01" label="Service Name" />
          <input
            name="name"
            type="text"
            required
            defaultValue={subscription.name}
            className={inputClass}
          />
        </div>

        {/* 02 Amount */}
        <div>
          <FieldLabel number="02" label="Amount" />
          <div className="grid grid-cols-3 gap-0">
            <input
              name="amount"
              type="number"
              required
              min="0"
              step="any"
              defaultValue={subscription.amount}
              className={`${inputClass} col-span-2 border-r-0`}
            />
            <select
              name="currency"
              defaultValue={subscription.currency}
              className={selectClass}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c} className="bg-[var(--bg)]">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 03 Billing Cycle */}
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
                  defaultChecked={subscription.billingCycle === cycle}
                />
                <span
                  className="w-full text-center font-mono text-[11px]
                             uppercase tracking-widest border border-[var(--border)]
                             py-3 text-[var(--text-muted)]
                             peer-checked:border-[var(--accent)]/50
                             peer-checked:text-[var(--accent)]
                             peer-checked:bg-[var(--accent)]/4
                             transition-all duration-200
                             -ml-px first:ml-0"
                >
                  {cycle}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 04 Next Billing Date */}
        <div>
          <FieldLabel number="04" label="Next Billing Date" />
          <input
            name="nextBillingDate"
            type="date"
            required
            defaultValue={toDateInputValue(subscription.nextBillingDate)}
            className={inputClass}
          />
        </div>

        {/* 05 Category */}
        <div>
          <FieldLabel number="05" label="Category" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-0">
            {CATEGORIES.map((cat) => (
              <label
                key={cat}
                className="relative flex items-center justify-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  required
                  className="peer sr-only"
                  defaultChecked={subscription.category === cat}
                />
                <span
                  className="w-full text-center font-mono text-[11px]
                             uppercase tracking-widest border border-[var(--border)]
                             py-3 text-[var(--text-muted)]
                             peer-checked:border-[var(--accent)]/50
                             peer-checked:text-[var(--accent)]
                             peer-checked:bg-[var(--accent)]/4
                             transition-all duration-200
                             -ml-px first:ml-0"
                >
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 06 Cancel URL */}
        <div>
          <FieldLabel number="06" label="Cancellation URL" optional />
          {subscription.cancelUrl && (
            <a
              href={subscription.cancelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-[10px]
                         text-[var(--accent)] uppercase tracking-widest
                         mb-2 hover:text-[var(--text-primary)] transition-colors"
            >
              ↗ Open cancellation page
            </a>
          )}
          <input
            name="cancelUrl"
            type="url"
            placeholder="https://example.com/cancel"
            defaultValue={subscription.cancelUrl ?? ""}
            className={inputClass}
          />
        </div>

        {/* 07 Trial */}
        <div>
          <FieldLabel number="07" label="Free Trial?" />
          <label className="relative flex items-center gap-4 cursor-pointer group">
            <input
              name="isTrial"
              type="checkbox"
              checked={isTrial}
              onChange={(e) => setIsTrial(e.target.checked)}
              className="sr-only peer"
            />
            <div
              className="w-10 h-5 border border-[var(--border)]
                         peer-checked:border-[var(--accent)]/50
                         peer-checked:bg-[var(--accent)]/10
                         transition-all duration-200 relative"
            >
              <div
                className={`absolute top-1 left-1 w-3 h-3 transition-all duration-200
                ${isTrial ? "bg-[var(--accent)] translate-x-5" : "bg-[var(--text-muted)]"}`}
              />
            </div>
            <span
              className="font-mono text-[11px] text-[var(--text-muted)]
                         uppercase tracking-widest
                         group-hover:text-[var(--text-secondary)] transition-colors"
            >
              {isTrial ? "Yes — this is a trial" : "No"}
            </span>
          </label>
          {isTrial && (
            <div className="mt-4">
              <FieldLabel number="07b" label="Trial End Date" />
              <input
                name="trialEndDate"
                type="date"
                defaultValue={toDateInputValue(subscription.trialEndDate)}
                className={inputClass}
              />
            </div>
          )}
        </div>

        {/* 08 Shared Subscription */}
        <div>
          <FieldLabel number="08" label="Shared Subscription?" optional />
          <label className="relative flex items-center gap-4 cursor-pointer group">
            <input
              name="isShared"
              type="checkbox"
              checked={isShared}
              onChange={(e) => setIsShared(e.target.checked)}
              className="sr-only peer"
            />
            <div
              className="w-10 h-5 border border-[var(--border)]
                         peer-checked:border-[var(--accent)]/50
                         peer-checked:bg-[var(--accent)]/10
                         transition-all duration-200 relative"
            >
              <div
                className={`absolute top-1 left-1 w-3 h-3 transition-all duration-200
                ${isShared ? "bg-[var(--accent)] translate-x-5" : "bg-[var(--text-muted)]"}`}
              />
            </div>
            <span
              className="font-mono text-[11px] text-[var(--text-muted)]
                         uppercase tracking-widest
                         group-hover:text-[var(--text-secondary)] transition-colors"
            >
              {isShared ? "Yes — splitting with others" : "No"}
            </span>
          </label>
          {isShared && (
            <div className="mt-4">
              <FieldLabel number="08b" label="Split Between How Many People?" />
              <input
                name="splitCount"
                type="number"
                min="2"
                max="10"
                defaultValue={subscription.splitCount}
                className={inputClass}
              />
              <p className="font-mono text-[10px] text-[var(--text-muted)] mt-2">
                Include yourself. e.g. 2 = you + 1 friend.
              </p>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-[var(--border-subtle)]">
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-3
                       bg-[var(--btn-invert-bg)] text-[var(--btn-invert-text)] font-bold text-sm
                       uppercase tracking-widest px-6 py-4
                       hover:bg-[var(--accent)] hover:text-[var(--accent-text)]
                       transition-colors duration-200
                       disabled:opacity-40
                       disabled:cursor-not-allowed"
          >
            {isPending ? "Saving..." : "Save Changes →"}
          </button>
        </div>
      </form>

      {/* Delete Section */}
      <div className="border-t border-[var(--border-subtle)] pt-8">
        {subscription.isActive && (
          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-4">
            Danger Zone
          </p>
        )}
        {subscription.isActive && (
          <>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full border border-[var(--danger-border)]
                           font-mono text-xs
                           uppercase tracking-widest px-6 py-3
                           hover:bg-[var(--danger-bg)]
                           hover:border-[var(--danger-border-strong)]
                           transition-colors"
                style={{ color: "var(--danger-text)" }}
              >
                Cancel Subscription
              </button>
            ) : (
              <div className="border border-[var(--danger-border-strong)] bg-[var(--danger-bg)] p-5 space-y-4">
                <p className="font-mono text-sm text-[var(--text-secondary)]">
                  This will mark{" "}
                  <span className="text-[var(--text-primary)]">{subscription.name}</span>{" "}
                  as cancelled. Your data is preserved but it won&apos;t
                  appear in active lists.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="border border-[var(--border)]
                               text-[var(--text-secondary)] font-mono text-xs
                               uppercase tracking-widest py-3
                               hover:text-[var(--text-secondary)]
                               transition-colors"
                  >
                    Keep It
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-white
                               font-mono text-xs uppercase
                               tracking-widest py-3
                               transition-colors
                               disabled:opacity-40
                               disabled:cursor-not-allowed"
                    style={{ backgroundColor: "var(--danger-solid)" }}
                    onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "var(--danger-solid-hover)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--danger-solid)"; }}
                  >
                    {isDeleting ? "Cancelling..." : "Yes, Cancel"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
