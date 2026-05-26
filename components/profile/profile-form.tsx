"use client";

import { useState, useTransition } from "react";
import { updateUserName, deleteAccount, updateEmailPreference  } from "@/app/actions/profile";
import Link from "next/link";
import { updateMonthlyBudget } from "@/app/actions/profile";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  _count: { subscriptions: number };
  monthlyBudget: number | null;
};

const inputClass = `
  w-full bg-transparent border border-[var(--border)] text-[var(--text-primary)] font-mono text-sm
  px-4 py-3 outline-none focus:border-[var(--accent)]/50
  placeholder:text-[var(--text-muted)] transition-all duration-200
`;

function FieldLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2 mb-2">
      <span className="font-mono text-[10px] text-[var(--accent)] tracking-widest">
        {number}
      </span>
      <span className="font-mono text-[11px] text-[var(--text-secondary)] uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

type Props = {
  user: User;
  monthlyTotal: number;
  emailRemindersEnabled: boolean;
}

export function ProfileForm({ user, monthlyTotal, emailRemindersEnabled: initialEnabled }: Props) {
  const [name, setName] = useState(user.name ?? "");
  const [remindersEnabled, setRemindersEnabled] = useState(initialEnabled);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isSaving, startSaveTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [budget, setBudget] = useState(
    user.monthlyBudget ? user.monthlyBudget.toString() : ""
  );
  const [budgetSaved, setBudgetSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    startSaveTransition(async () => {
      await updateUserName(name);
    });
  }

  function handleDelete() {
    startDeleteTransition(async () => {
      await deleteAccount();
    });
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-10">

      {/* Account summary */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-5 flex items-center gap-4">
        {/* Avatar */}
        {user.image ? (
          <img
            src={user.image}
            alt={user.name ?? "User"}
            className="w-12 h-12 rounded-full shrink-0"
          />
        ) : (
          <div className="w-12 h-12 border border-[var(--border)] flex items-center
                          justify-center font-mono text-lg font-bold text-[var(--text-secondary)] shrink-0">
            {(user.name ?? user.email ?? "?")[0].toUpperCase()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-bold text-[var(--text-primary)] truncate">
            {user.name ?? "No name set"}
          </p>
          <p className="font-mono text-[11px] text-[var(--text-muted)] truncate mt-0.5">
            {user.email}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
            Member since
          </p>
          <p className="font-mono text-[11px] text-[var(--text-secondary)] mt-0.5">
            {memberSince}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/subscriptions"
          className="group bg-[var(--bg-card)] border border-[var(--border)] p-4
                     hover:border-[var(--accent)]/30 transition-colors duration-200"
        >
          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">
            Subscriptions
          </p>
          <p className="text-2xl font-black text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
            {user._count.subscriptions}
          </p>
          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-1">
            View all →
          </p>
        </Link>

        <Link
          href="/analytics"
          className="group bg-[var(--bg-card)] border border-[var(--border)] p-4
                     hover:border-[var(--accent)]/30 transition-colors duration-200"
        >
          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">
            Spending
          </p>
          <p className="text-2xl font-black text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
            ₹{Math.round(monthlyTotal).toLocaleString("en-IN")}
          </p>
          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-1">
            View analytics →
          </p>
        </Link>
      </div>

      {/* Edit name form */}
      <form onSubmit={handleSave} className="border-t border-[var(--border-subtle)] pt-8 space-y-6">
        <div>
          <FieldLabel number="01" label="Display Name" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
          <p className="font-mono text-[10px] text-[var(--text-muted)] mt-2">
            This is shown on your dashboard greeting.
          </p>
        </div>

        <div>
          <FieldLabel number="02" label="Email Address" />
          <div className="relative">
            <input
              type="email"
              value={user.email ?? ""}
              readOnly
              disabled
              className={`${inputClass} opacity-30 cursor-not-allowed`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2
                             font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-widest">
              Via Google
            </span>
          </div>
          <p className="font-mono text-[10px] text-[var(--text-muted)] mt-2">
            Email is managed by your Google account and cannot be changed here.
          </p>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <FieldLabel number="03" label="Monthly Budget" />
            {budgetSaved && (
            <span
              className="font-mono text-[9px] text-[var(--accent)] uppercase tracking-widest animate-pulse"
            >
              Saved ✓
            </span>
            )}
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-[var(--text-muted)]">
              ₹
            </span>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              onBlur={async () => {
                const val = parseFloat(budget);
                await updateMonthlyBudget(isNaN(val) ? null : val);
                setBudgetSaved(true);
                setTimeout(() => setBudgetSaved(false), 2000);
              }}
              placeholder="e.g. 2000"
              className={`${inputClass} pl-8`}
            />
          </div>
          <p className="font-mono text-[10px] text-[var(--text-muted)] mt-2">
            Get alerted on dashboard when spending exceeds 80% of this.
          </p>
        </div>

        <div>
          <FieldLabel number="04" label="Email Reminders" />
          <div className="flex items-center justify-between border border-[var(--border)] px-4 py-3">
            <div>
              <p className="font-mono text-xs text-[var(--text-secondary)]">
                {remindersEnabled ? "Reminders are on" : "Reminders are off"}
              </p>
              <p className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5">
                Billing alerts 2 days before renewal and on due date
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                const next = !remindersEnabled;
                setRemindersEnabled(next);
                await updateEmailPreference(next);
              }}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0
                          ${remindersEnabled ? "bg-[var(--accent)]" : "bg-[var(--text-faint)]"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-black transition-transform duration-200
                            ${remindersEnabled ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={
            isSaving ||name === (user.name ?? "")
          }
          className="w-full bg-[var(--btn-invert-bg)] text-[var(--btn-invert-text)] font-bold text-sm uppercase
                     tracking-widest px-6 py-4 hover:bg-[var(--accent)] hover:text-[var(--accent-text)]
                     transition-colors duration-200
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Changes →"}
        </button>
      </form>

      {/* Danger zone */}
      <div className="border-t border-[var(--border-subtle)] pt-8">
        <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-4">
          Danger Zone
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full border border-[var(--danger-border)] font-mono text-xs
                       uppercase tracking-widest px-6 py-3
                       hover:bg-[var(--danger-bg)] hover:border-[var(--danger-border-strong)] transition-colors"
            style={{ color: "var(--danger-text)" }}
          >
            Delete Account
          </button>
        ) : (
          <div className="border border-[var(--danger-border-strong)] bg-[var(--danger-bg)] p-5 space-y-4">
            <p className="font-mono text-sm text-[var(--text-secondary)] leading-relaxed">
              This permanently deletes your account and{" "}
              <span className="text-[var(--text-primary)]">
                all {user._count.subscriptions} subscriptions
              </span>
              . This cannot be undone.
            </p>
            <p className="font-mono text-[11px] text-[var(--text-secondary)] uppercase tracking-widest">
              Type DELETE to confirm
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="DELETE"
              className={inputClass}
            />
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteInput("");
                }}
                className="border border-[var(--border)] text-[var(--text-secondary)] font-mono text-xs
                           uppercase tracking-widest py-3
                           hover:text-[var(--text-secondary)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteInput !== "DELETE" || isDeleting}
                className="text-white font-mono text-xs
                           uppercase tracking-widest py-3
                           transition-colors
                           disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--danger-solid)" }}
                onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "var(--danger-solid-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--danger-solid)"; }}
              >
                {isDeleting ? "Deleting..." : "Delete Everything"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
