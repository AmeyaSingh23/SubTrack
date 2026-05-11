"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

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

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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
  { href: "/subscriptions", label: "Subscriptions", icon: SubscriptionsIcon },
  { href: "/analytics", label: "Analytics", icon: AnalyticsIcon },
  { href: "/reminders", label: "Reminders", icon: RemindersIcon },
];

function SidebarItem({
  href,
  label,
  icon: Icon,
  isActive,
  collapsed,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ComponentType;
  isActive: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        group relative flex items-center gap-3 px-3 h-10 rounded-lg
        transition-all duration-200 ease-out
        ${isActive ? "bg-white/8 text-white" : "text-white/40 hover:text-white/90 hover:bg-white/4"}
        ${collapsed ? "justify-center px-0" : ""}
      `}
    >
      {isActive && (
        <div className="absolute inset-0 rounded-lg bg-linear-to-r from-white/6 to-transparent opacity-60" />
      )}
      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-white transition-all duration-200 ${isActive ? "opacity-100" : "opacity-0"}`} />
      <span className={`relative flex items-center justify-center w-5 h-5 shrink-0 ${collapsed ? "" : "ml-1"}`}>
        <Icon />
      </span>
      <span className={`relative text-[13px] font-medium tracking-[-0.01em] whitespace-nowrap transition-all duration-200 ease-out ${collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}`}>
        {label}
      </span>
    </Link>
  );
}

function SidebarContent({
  collapsed,
  setCollapsed,
  onNavClick,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  onNavClick?: () => void;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex flex-col h-full">
      <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent pointer-events-none" />

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
                onClick={onNavClick}
              />
            );
          })}
        </div>
      </nav>

      <div className="relative px-3 py-4 border-t border-white/4">
        <div className={`flex items-center gap-2 mb-4 px-3 ${collapsed ? "justify-center px-0" : ""}`}>
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-40" />
          </div>
          <span className={`text-[11px] font-medium text-white/30 uppercase tracking-wider transition-all duration-300 ${collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}`}>
            System Active
          </span>
        </div>

        <Link
          href="/profile"
          onClick={onNavClick}
          className={`group flex items-center gap-3 w-full h-10 rounded-lg text-white/90 hover:bg-white/4 transition-colors duration-200 ease-out ${collapsed ? "justify-center px-0" : "px-3"}`}
        >
          <div className={`flex items-center gap-3 py-2 rounded-lg w-full ${collapsed ? "justify-center" : ""}`}>
            <div className="w-7 h-7 rounded-full overflow-hidden bg-linear-to-br from-violet-500/80 to-indigo-600/80 flex items-center justify-center shrink-0">
              {session?.user?.image ? (
                <img src={session.user.image} alt={session.user.name ?? "User"} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[11px] font-semibold text-white">
                  {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className={`flex flex-col transition-all duration-300 ${collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}`}>
              <span className="text-[13px] font-medium text-white/90 whitespace-nowrap">
                {session?.user?.name?.split(" ")[0] || "User"}
              </span>
            </div>
          </div>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={`group flex items-center gap-3 w-full px-3 h-10 rounded-lg text-white/40 hover:text-white/90 hover:bg-white/4 transition-all duration-200 ease-out ${collapsed ? "justify-center px-0" : ""}`}
        >
          <span className="flex items-center justify-center w-5 h-5 shrink-0"><LogoutIcon /></span>
          <span className={`text-[13px] font-medium tracking-[-0.01em] whitespace-nowrap transition-all duration-300 ${collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}`}>
            Sign out
          </span>
        </button>

        {/* Collapse — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`group hidden md:flex items-center gap-3 w-full px-3 h-10 rounded-lg mt-1 text-white/30 hover:text-white/60 hover:bg-white/4 transition-all duration-200 ease-out ${collapsed ? "justify-center px-0" : ""}`}
        >
          <span className={`flex items-center justify-center w-5 h-5 shrink-0 transition-transform duration-300 ease-out ${collapsed ? "rotate-180" : "rotate-0"}`}>
            <CollapseIcon />
          </span>
          <span className={`text-[13px] font-medium tracking-[-0.01em] whitespace-nowrap transition-all duration-300 ${collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}`}>
            Collapse
          </span>
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ── MOBILE: hamburger button fixed to top-left ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#0a0a0a] border border-white/10 text-white/60 hover:text-white transition-colors"
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>

      {/* ── MOBILE: overlay backdrop ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE: slide-in sidebar ── */}
      <aside
        className={`
          md:hidden fixed top-0 left-0 z-50 h-full w-64
          bg-[#0a0a0a] border-r border-white/6
          transition-transform duration-300 ease-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-white/40 hover:text-white transition-colors"
        >
          <CloseIcon />
        </button>
        <SidebarContent
          collapsed={false}
          setCollapsed={setCollapsed}
          onNavClick={() => setMobileOpen(false)}
        />
      </aside>

      {/* ── DESKTOP: regular sidebar ── */}
      <aside
        className={`
          hidden md:flex flex-col h-full shrink-0
          bg-[#0a0a0a] border-r border-white/6
          transition-all duration-300 ease-out
          ${collapsed ? "w-16" : "w-60"}
        `}
      >
        <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>
    </>
  );
}