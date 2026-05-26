"use client";

import { useEffect, useState } from "react";

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export function ThemeToggle({ collapsed }: { collapsed: boolean }) {
  // Start with null to avoid hydration mismatch — the actual theme is set
  // by the inline script in layout.tsx before React hydrates
  const [theme, setTheme] = useState<"dark" | "light" | null>(null);

  useEffect(() => {
    // Read the theme that the inline script already set on <html>
    const current = (document.documentElement.getAttribute("data-theme") as "dark" | "light") || "dark";
    setTheme(current);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  // Don't render until we know the theme (prevents flash of wrong icon)
  if (theme === null) {
    return (
      <div
        className={`flex items-center gap-3 w-full px-3 h-10 rounded-lg ${
          collapsed ? "justify-center px-0" : ""
        }`}
      >
        <span className="flex items-center justify-center w-5 h-5 shrink-0" />
      </div>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`group flex items-center gap-3 w-full px-3 h-10 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-all duration-200 ease-out ${
        collapsed ? "justify-center px-0" : ""
      }`}
    >
      <span className="flex items-center justify-center w-5 h-5 shrink-0">
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </span>
      <span
        className={`text-[13px] font-medium tracking-[-0.01em] whitespace-nowrap transition-all duration-300 ${
          collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
        }`}
      >
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </span>
    </button>
  );
}
