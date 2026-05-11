// components/profile/profile-form.tsx
"use client";

import { useState, useTransition } from "react";
import { updateUserName, deleteAccount } from "@/app/actions/profile";
import Link from "next/link";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  _count: { subscriptions: number };
};

const inputClass = `
  w-full bg-transparent border border-white/8 text-white font-mono text-sm
  px-4 py-3 outline-none focus:border-[#c8ff00]/50
  placeholder:text-white/20 transition-all duration-200
`;

function FieldLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2 mb-2">
      <span className="font-mono text-[10px] text-[#c8ff00] tracking-widest">
        {number}
      </span>
      <span className="font-mono text-[11px] text-white/40 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

type Props = {
  user: User;
  monthlyTotal: number;
}

export function ProfileForm({ user, monthlyTotal }: Props) {
  const [name, setName] = useState(user.name ?? "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isSaving, startSaveTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

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
      <div className="bg-white/3 border border-white/7 p-5 flex items-center gap-4">
        {/* Avatar */}
        {user.image ? (
          <img
            src={user.image}
            alt={user.name ?? "User"}
            className="w-12 h-12 rounded-full shrink-0"
          />
        ) : (
          <div className="w-12 h-12 border border-white/10 flex items-center
                          justify-center font-mono text-lg font-bold text-white/40 shrink-0">
            {(user.name ?? user.email ?? "?")[0].toUpperCase()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-bold text-white/90 truncate">
            {user.name ?? "No name set"}
          </p>
          <p className="font-mono text-[11px] text-white/30 truncate mt-0.5">
            {user.email}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
            Member since
          </p>
          <p className="font-mono text-[11px] text-white/40 mt-0.5">
            {memberSince}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/subscriptions"
          className="group bg-white/3 border border-white/7 p-4
                     hover:border-[#c8ff00]/30 transition-colors duration-200"
        >
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-1">
            Subscriptions
          </p>
          <p className="text-2xl font-black text-white group-hover:text-[#c8ff00] transition-colors">
            {user._count.subscriptions}
          </p>
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mt-1">
            View all →
          </p>
        </Link>

        <Link
          href="/analytics"
          className="group bg-white/3 border border-white/7 p-4
                     hover:border-[#c8ff00]/30 transition-colors duration-200"
        >
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-1">
            Spending
          </p>
          <p className="text-2xl font-black text-white group-hover:text-[#c8ff00] transition-colors">
            ₹{Math.round(monthlyTotal).toLocaleString("en-IN")}
          </p>
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mt-1">
            View analytics →
          </p>
        </Link>
      </div>

      {/* Edit name form */}
      <form onSubmit={handleSave} className="border-t border-white/6 pt-8 space-y-6">
        <div>
          <FieldLabel number="01" label="Display Name" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
          <p className="font-mono text-[10px] text-white/20 mt-2">
            This is shown on your dashboard greeting.
          </p>
        </div>

        <div>
          <FieldLabel number="02" label="Email Address" />
          <div className="relative">
            <input
              type="email"
              value={user.email ?? ""}
              disabled
              className={`${inputClass} opacity-30 cursor-not-allowed`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2
                             font-mono text-[9px] text-white/20 uppercase tracking-widest">
              Via Google
            </span>
          </div>
          <p className="font-mono text-[10px] text-white/20 mt-2">
            Email is managed by your Google account and cannot be changed here.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving || name === (user.name ?? "")}
          className="w-full bg-white text-black font-bold text-sm uppercase
                     tracking-widest px-6 py-4 hover:bg-[#c8ff00]
                     transition-colors duration-200
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Changes →"}
        </button>
      </form>

      {/* Danger zone */}
      <div className="border-t border-white/6 pt-8">
        <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-4">
          Danger Zone
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full border border-red-500/20 text-red-400 font-mono text-xs
                       uppercase tracking-widest px-6 py-3
                       hover:bg-red-500/5 hover:border-red-500/40 transition-colors"
          >
            Delete Account
          </button>
        ) : (
          <div className="border border-red-500/30 bg-red-500/5 p-5 space-y-4">
            <p className="font-mono text-sm text-white/60 leading-relaxed">
              This permanently deletes your account and{" "}
              <span className="text-white">
                all {user._count.subscriptions} subscriptions
              </span>
              . This cannot be undone.
            </p>
            <p className="font-mono text-[11px] text-white/40 uppercase tracking-widest">
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
                className="border border-white/10 text-white/40 font-mono text-xs
                           uppercase tracking-widest py-3
                           hover:text-white/60 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteInput !== "DELETE" || isDeleting}
                className="bg-red-500/80 text-white font-mono text-xs
                           uppercase tracking-widest py-3
                           hover:bg-red-500 transition-colors
                           disabled:opacity-30 disabled:cursor-not-allowed"
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