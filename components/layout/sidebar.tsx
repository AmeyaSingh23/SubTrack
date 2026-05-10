"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

// Icons
function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function SubscriptionsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z" />
      <path d="M2 9v1c0 1.1.9 2 2 2h1" />
      <circle cx="16" cy="11" r="1" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}

function RemindersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m11 17-5-5 5-5" />
      <path d="m18 17-5-5 5-5" />
    </svg>
  );
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/subscriptions/new", label: "Subscriptions", icon: SubscriptionsIcon },
  { href: "/analytics", label: "Analytics", icon: AnalyticsIcon },
  { href: "/reminders", label: "Reminders", icon: RemindersIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

function SidebarItem({
  href,
  label,
  icon: Icon,
  isActive,
  collapsed,
}: {
  href: string;
  label: string;
  icon: React.ComponentType;
  isActive: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        group relative flex items-center gap-3 px-3 h-10 rounded-lg
        transition-all duration-200 ease-out
        ${isActive
          ? "bg-white/8 text-white"
          : "text-white/40 hover:text-white/90 hover:bg-white/4"
        }
        ${collapsed ? "justify-center px-0" : ""}
      `}
    >
      {/* Active indicator glow */}
      {isActive && (
        <div className="absolute inset-0 rounded-lg bg-linear-to-r from-white/6 to-transparent opacity-60" />
      )}
      
      {/* Left accent bar for active state */}
      <div
        className={`
          absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full
          bg-white transition-all duration-200
          ${isActive ? "opacity-100" : "opacity-0"}
        `}
      />

      <span className={`relative flex items-center justify-center w-5 h-5 shrink-0 ${collapsed ? "" : "ml-1"}`}>
        <Icon />
      </span>

      <span
        className={`
          relative text-[13px] font-medium tracking-[-0.01em] whitespace-nowrap
          transition-all duration-200 ease-out
          ${collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}
        `}
      >
        {label}
      </span>
    </Link>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside
      className={`
        relative flex flex-col h-screen shrink-0
        bg-[#0a0a0a] border-r border-white/6
        transition-all duration-300 ease-out
        ${collapsed ? "w-16" : "w-60"}
      `}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent pointer-events-none" />

      {/* Header */}
      <div className={`relative flex items-center h-16 px-4 ${collapsed ? "justify-center" : ""}`}>
        <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${collapsed ? "w-8" : "w-full"}`}>
          {/* Logo mark */}
          <div className="relative w-8 h-8 rounded-lg bg-linear-to-br from-white/90 to-white/70 flex items-center justify-center shrink-0 shadow-lg shadow-white/3">
            <span className="text-sm font-bold text-[#0a0a0a] tracking-tight">S</span>
            {/* Subtle shine */}
            <div className="absolute inset-0 rounded-lg bg-linear-to-br from-white/20 to-transparent" />
          </div>

          {/* Brand text */}
          <div className={`flex flex-col transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
            <span className="text-[15px] font-semibold text-white tracking-[-0.02em] whitespace-nowrap">
              SubTrack
            </span>
            <span className="text-[10px] font-medium text-white/30 tracking-[0.02em] uppercase whitespace-nowrap">
              Finance OS
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 px-3 py-2">
        <div className="space-y-1">
          {navItems.map(({ href, label, icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <SidebarItem
                key={href}
                href={href}
                label={label}
                icon={icon}
                isActive={isActive}
                collapsed={collapsed}
              />
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="relative px-3 py-4 border-t border-white/4">
        {/* Status indicator */}
        <div className={`flex items-center gap-2 mb-4 px-3 ${collapsed ? "justify-center px-0" : ""}`}>
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-40" />
          </div>
          <span
            className={`
              text-[11px] font-medium text-white/30 uppercase tracking-wider
              transition-all duration-300
              ${collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}
            `}
          >
            System Active
          </span>
        </div>

        {/* User section */}
        <div className={`flex items-center gap-3 px-3 py-2 rounded-lg bg-white/2 mb-2 ${collapsed ? "justify-center px-2" : ""}`}>
          <div className="w-7 h-7 rounded-full overflow-hidden bg-linear-to-br from-violet-500/80 to-indigo-600/80 flex items-center justify-center shrink-0">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name ?? "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[11px] font-semibold text-white">
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div className={`flex flex-col transition-all duration-300 ${collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}`}>
            <span className="text-[13px] font-medium text-white/90 whitespace-nowrap">{session?.user?.name || "User"}</span>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={`
            group flex items-center gap-3 w-full px-3 h-10 rounded-lg
            text-white/40 hover:text-white/90 hover:bg-white/4
            transition-all duration-200 ease-out
            ${collapsed ? "justify-center px-0" : ""}
          `}
        >
          <span className="flex items-center justify-center w-5 h-5 shrink-0">
            <LogoutIcon />
          </span>
          <span
            className={`
              text-[13px] font-medium tracking-[-0.01em] whitespace-nowrap
              transition-all duration-300
              ${collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}
            `}
          >
            Sign out
          </span>
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            group flex items-center gap-3 w-full px-3 h-10 rounded-lg mt-1
            text-white/30 hover:text-white/60 hover:bg-white/4
            transition-all duration-200 ease-out
            ${collapsed ? "justify-center px-0" : ""}
          `}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span
            className={`
              flex items-center justify-center w-5 h-5 shrink-0
              transition-transform duration-300 ease-out
              ${collapsed ? "rotate-180" : "rotate-0"}
            `}
          >
            <CollapseIcon />
          </span>
          <span
            className={`
              text-[13px] font-medium tracking-[-0.01em] whitespace-nowrap
              transition-all duration-300
              ${collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}
            `}
          >
            Collapse
          </span>
        </button>
      </div>
    </aside>
  );
}
