import Link from "next/link";
import { SmoothScrollLink } from "@/components/ui/smooth-scroll-link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const FEATURES = [
  {
    num: "01",
    title: "48-Hour Alerts",
    body: "Email reminders land before every charge. Cancel before it's too late.",
  },
  {
    num: "02",
    title: "Trial Countdowns",
    body: "Free trials are traps. SubTrack watches them so you don't get caught.",
  },
  {
    num: "03",
    title: "One-Click Cancel",
    body: "Direct links to cancellation pages. No hunting through settings menus.",
  },
];

const STATS = [
  { value: "$127", label: "avg. annual waste on forgotten subscriptions*" },
  { value: "64.8%", label: "of people forgot to cancel a free trial*" },
  { value: "8.2", label: "avg. active subscriptions per person*" },
];

export default async function HomePage() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] overflow-x-hidden">
      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[var(--accent)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-[var(--text-secondary)]">SubTrack</span>
        </div>
        <div className="flex items-center gap-6">
          <SmoothScrollLink
            targetId="features"
            className="font-mono text-[11px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] uppercase tracking-widest transition-colors hidden md:block"
          >
            Features
          </SmoothScrollLink>
          <Link
            href="/login"
            className="font-mono text-[11px] text-[var(--btn-invert-text)] bg-[var(--btn-invert-bg)] hover:bg-[var(--accent)] hover:text-[var(--accent-text)]
                       uppercase tracking-widest px-4 py-2 transition-colors duration-200"
          >
            Sign In / Sign Up →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 md:px-12 pt-16 md:pt-24 pb-16 border-b border-[var(--border-subtle)]">
        <div className="max-w-5xl">

          {/* Eyebrow */}
          <p className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-[0.4em] mb-8">
            Subscription Management — Free
          </p>

          {/* Hero headline */}
          <h1 className="text-[clamp(3rem,10vw,8rem)] font-black tracking-[-0.04em] leading-[0.9] mb-8">
            You're paying<br />
            <span className="text-[var(--text-muted)]">for things</span><br />
            you forgot.
          </h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-12">
            <Link
              href="/login"
              className="relative group flex items-center gap-3 bg-[var(--accent)] text-[var(--accent-text)]
                         font-bold text-sm uppercase tracking-widest px-8 py-4
                         hover:bg-[var(--btn-invert-bg)] hover:text-[var(--btn-invert-text)] transition-colors duration-200
                         before:absolute before:inset-0 before:border-2 before:border-[var(--accent)]/30
                         before:translate-x-1.5 before:translate-y-1.5 before:-z-10
                         hover:before:translate-x-2.5 hover:before:translate-y-2.5
                         before:transition-transform before:duration-300"
            >
              Start Tracking Free
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <p className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-widest">
              Google sign-in. No credit card.
            </p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative z-10 border-b border-[var(--border-subtle)]">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--border-subtle)]">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-8 md:px-12 py-10">
              <p className="text-4xl md:text-5xl font-black tracking-[-0.04em] text-[var(--text-primary)] mb-2">
                {stat.value}
              </p>
              <p className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem statement */}
      <section className="relative z-10 px-6 md:px-12 py-16 md:py-24 border-b border-[var(--border-subtle)]">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-[0.4em] mb-8">
            The Problem
          </p>
          <p className="text-2xl md:text-4xl font-bold tracking-[-0.02em] leading-tight text-[var(--text-primary)]">
            The average person has{" "}
            <span className="text-[var(--text-primary)]">nearly a dozen active subscriptions</span> and can
            only recall <span className="text-[var(--accent)]">half of them</span>.
            The rest quietly drain accounts every month.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 border-b border-[var(--border-subtle)]">
        <div className="px-6 md:px-12 py-12">
          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-[0.4em] mb-12">
            What SubTrack Does
          </p>
        </div>
        <div className="divide-y divide-[var(--border-subtle)]">
          {FEATURES.map((f) => (
            <div
              key={f.num}
              className="group flex items-start gap-8 px-6 md:px-12 py-8
                         hover:bg-[var(--bg-card)] transition-colors duration-300"
            >
              <span className="font-mono text-[11px] text-[var(--accent)] tracking-widest pt-1 shrink-0">
                {f.num}
              </span>
              <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h3 className="text-xl md:text-2xl font-bold tracking-[-0.02em] text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-300">
                  {f.title}
                </h3>
                <p className="font-mono text-sm text-[var(--text-muted)] md:max-w-sm leading-relaxed">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 md:px-12 py-24 md:py-32 border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl">
          <p className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-[0.4em] mb-8">
            Get Started
          </p>
          <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-black tracking-[-0.04em] leading-[0.9] mb-12">
            Know exactly<br />
            <span className="text-[var(--text-muted)]">what you pay.</span>
          </h2>
          <Link
            href="/login"
            className="relative group inline-flex items-center gap-3 bg-[var(--btn-invert-bg)] text-[var(--btn-invert-text)]
                       font-bold text-sm uppercase tracking-widest px-8 py-4
                       hover:bg-[var(--accent)] hover:text-[var(--accent-text)] transition-colors duration-200
                       before:absolute before:inset-0 before:border-2 before:border-[var(--border)]
                       before:translate-x-1.5 before:translate-y-1.5 before:-z-10
                       before:transition-transform before:duration-300
                       hover:before:translate-x-2.5 hover:before:translate-y-2.5"
          >
            Manage Subscriptions
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[var(--text-muted)]">SubTrack</span>
            <span className="font-mono text-[10px] text-[var(--text-faint)]">—</span>
            <span suppressHydrationWarning className="font-mono text-[10px] text-[var(--text-faint)] uppercase tracking-widest">
              {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] uppercase tracking-widest transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] uppercase tracking-widest transition-colors">
              Terms of Service
            </Link>
            <Link href="/login" className="font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--accent)] uppercase tracking-widest transition-colors">
              Sign In →
            </Link>
          </div>
        </div>
        <p className="font-mono text-[9px] text-[var(--text-faint)] mt-4">
          * Sources: Self Financial 2025, industry aggregated data 2025
        </p>
      </footer>
    </main>
  );
}
