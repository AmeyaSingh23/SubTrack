import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen overflow-y-auto bg-[var(--bg)] text-[var(--text-primary)] font-mono selection:bg-[#c8ff00] selection:text-black">
      {/* Navigation */}
      <nav className="border-b-4 border-[var(--text-primary)]">
        <div className="max-w-4xl mx-auto px-6 py-6">    
            <Link href="/" className="flex items-center gap-3 group">
                <div className="w-3 h-3 bg-[var(--accent)] group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors duration-200">SubTrack</span>
            </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="border-b-4 border-[var(--text-primary)]">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          <p className="text-[var(--accent)] text-sm uppercase tracking-[0.3em] mb-6">
            Legal
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-6 text-[var(--text-secondary)] text-sm uppercase tracking-wider">
            Last updated — May 2026
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-16">
          {/* Section 01 */}
          <section>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-[var(--accent)] text-xs uppercase tracking-widest">01</span>
              <h2 className="text-2xl font-bold">What We Collect</h2>
            </div>
            <div className="border-t border-[var(--border)] pt-6 text-[var(--text-primary)] leading-relaxed space-y-4">
              <p>SubTrack collects the minimum data required to function:</p>
              <ul className="space-y-2 ml-6">
                <li className="before:content-['—'] before:mr-3 before:text-[var(--accent)]">Your name and email address (via Google OAuth)</li>
                <li className="before:content-['—'] before:mr-3 before:text-[var(--accent)]">Subscription data you manually enter (service names, costs, renewal dates)</li>
                <li className="before:content-['—'] before:mr-3 before:text-[var(--accent)]">Your notification preferences</li>
              </ul>
              <p className="text-[var(--text-secondary)] text-sm mt-6">
                We do NOT collect payment information, bank credentials, or financial account access. Ever.
              </p>
            </div>
          </section>

          {/* Section 02 */}
          <section>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-[var(--accent)] text-xs uppercase tracking-widest">02</span>
              <h2 className="text-2xl font-bold">How We Use It</h2>
            </div>
            <div className="border-t border-[var(--border)] pt-6 text-[var(--text-primary)] leading-relaxed space-y-4">
              <p>Your data is used exclusively for:</p>
              <ul className="space-y-2 ml-6">
                <li className="before:content-['—'] before:mr-3 before:text-[var(--accent)]">Displaying your subscription dashboard</li>
                <li className="before:content-['—'] before:mr-3 before:text-[var(--accent)]">Sending email reminders before renewal dates</li>
                <li className="before:content-['—'] before:mr-3 before:text-[var(--accent)]">Calculating cost summaries and analytics</li>
              </ul>
              <p>We don&apos;t sell your data. We don&apos;t share it with advertisers. We don&apos;t build profiles for third parties.</p>
            </div>
          </section>

          {/* Section 03 */}
          <section>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-[var(--accent)] text-xs uppercase tracking-widest">03</span>
              <h2 className="text-2xl font-bold">Data Storage</h2>
            </div>
            <div className="border-t border-[var(--border)] pt-6 text-[var(--text-primary)] leading-relaxed space-y-4">
              <p>
                Your data is stored in a Neon PostgreSQL database. Neon provides serverless Postgres with encryption at rest and in transit. The database is hosted in the United States.
              </p>
            </div>
          </section>

          {/* Section 04 */}
          <section>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-[var(--accent)] text-xs uppercase tracking-widest">04</span>
              <h2 className="text-2xl font-bold">Third Parties</h2>
            </div>
            <div className="border-t border-[var(--border)] pt-6 text-[var(--text-primary)] leading-relaxed space-y-4">
              <p>SubTrack integrates with the following services:</p>
              <ul className="space-y-2 ml-6">
                <li className="before:content-['—'] before:mr-3 before:text-[var(--accent)]">
                  <strong className="text-[var(--text-primary)]">Google OAuth</strong> — Authentication only. We receive your name and email.
                </li>
                <li className="before:content-['—'] before:mr-3 before:text-[var(--accent)]">
                  <strong className="text-[var(--text-primary)]">Neon</strong> — Database hosting and storage.
                </li>
                <li className="before:content-['—'] before:mr-3 before:text-[var(--accent)]">
                  <strong className="text-[var(--text-primary)]">Vercel</strong> — Application hosting and deployment.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 05 */}
          <section>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-[var(--accent)] text-xs uppercase tracking-widest">05</span>
              <h2 className="text-2xl font-bold">Your Rights</h2>
            </div>
            <div className="border-t border-[var(--border)] pt-6 text-[var(--text-primary)] leading-relaxed space-y-4">
              <p>
                You own your data. You can request complete deletion of your account and all associated data at any time by contacting us. We will process deletion requests within 30 days.
              </p>
            </div>
          </section>

          {/* Section 06 */}
          <section>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-[var(--accent)] text-xs uppercase tracking-widest">06</span>
              <h2 className="text-2xl font-bold">Cookies</h2>
            </div>
            <div className="border-t border-[var(--border)] pt-6 text-[var(--text-primary)] leading-relaxed space-y-4">
              <p>
                We use session cookies only — required for authentication. No tracking cookies. No analytics cookies. No third-party advertising cookies.
              </p>
            </div>
          </section>

          {/* Section 07 */}
          <section>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-[var(--accent)] text-xs uppercase tracking-widest">07</span>
              <h2 className="text-2xl font-bold">Contact</h2>
            </div>
            <div className="border-t border-[var(--border)] pt-6 text-[var(--text-primary)] leading-relaxed space-y-4">
              <p>
                Questions about this policy? Email us at{" "}
                <a href="mailto:ameyasingh619@gmail.com" className="text-[var(--accent)] hover:underline">
                  ameyasingh619@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* Disclosure */}
          <section className="border-2 border-[var(--text-muted)] p-6">
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              <strong className="text-[var(--text-secondary)]">Honest disclosure:</strong> SubTrack is a student portfolio project built to demonstrate full-stack development skills. It is not a commercial product and makes no guarantees about long-term availability or support.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-[var(--text-primary)]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <p className="text-[var(--text-secondary)] text-sm">
              © 2026 SubTrack
            </p>
            <div className="flex gap-8">
              <Link href="/" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent)] transition-colors">
                Home
              </Link>
              <Link href="/terms" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent)] transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
