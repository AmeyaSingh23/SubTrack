import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono selection:bg-[#c8ff00] selection:text-black">
      {/* Navigation */}
      <nav className="border-b-4 border-white">
        <div className="max-w-4xl mx-auto px-6 py-6">
            <Link href="/" className="flex items-center gap-3 group">
                <div className="w-3 h-3 bg-[#c8ff00] group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-white/60 group-hover:text-white transition-colors duration-200">SubTrack</span>
            </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="border-b-4 border-white">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          <p className="text-[#c8ff00] text-sm uppercase tracking-[0.3em] mb-6">
            Legal
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-6 text-white/40 text-sm uppercase tracking-wider">
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
              <span className="text-[#c8ff00] text-xs uppercase tracking-widest">01</span>
              <h2 className="text-2xl font-bold">Acceptance</h2>
            </div>
            <div className="border-t border-white/10 pt-6 text-white/70 leading-relaxed space-y-4">
              <p>
                By accessing or using SubTrack, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
              </p>
            </div>
          </section>

          {/* Section 02 */}
          <section>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-[#c8ff00] text-xs uppercase tracking-widest">02</span>
              <h2 className="text-2xl font-bold">What SubTrack Is</h2>
            </div>
            <div className="border-t border-white/10 pt-6 text-white/70 leading-relaxed space-y-4">
              <p>
                SubTrack is a personal subscription tracking tool. You manually enter your subscriptions, and we help you track costs and renewal dates.
              </p>
              <p className="text-white/40 text-sm border-l-2 border-[#c8ff00] pl-4">
                SubTrack is NOT a financial service. We do not connect to your bank. We do not access your payment methods. We do not process transactions. We have no ability to cancel subscriptions on your behalf — we only provide links to help you do it yourself.
              </p>
            </div>
          </section>

          {/* Section 03 */}
          <section>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-[#c8ff00] text-xs uppercase tracking-widest">03</span>
              <h2 className="text-2xl font-bold">Account Requirements</h2>
            </div>
            <div className="border-t border-white/10 pt-6 text-white/70 leading-relaxed space-y-4">
              <p>To use SubTrack, you must:</p>
              <ul className="space-y-2 ml-6">
                <li className="before:content-['—'] before:mr-3 before:text-[#c8ff00]">Sign in with a valid Google account</li>
                <li className="before:content-['—'] before:mr-3 before:text-[#c8ff00]">Be at least 13 years of age</li>
                <li className="before:content-['—'] before:mr-3 before:text-[#c8ff00]">Provide accurate information about your subscriptions</li>
              </ul>
              <p>
                You are responsible for maintaining the security of your Google account. SubTrack is not responsible for unauthorized access resulting from compromised Google credentials.
              </p>
            </div>
          </section>

          {/* Section 04 */}
          <section>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-[#c8ff00] text-xs uppercase tracking-widest">04</span>
              <h2 className="text-2xl font-bold">Data Ownership</h2>
            </div>
            <div className="border-t border-white/10 pt-6 text-white/70 leading-relaxed space-y-4">
              <p>
                You own all data you enter into SubTrack. Your subscription information, preferences, and settings remain your property. We claim no ownership over user-submitted content.
              </p>
              <p>
                By using SubTrack, you grant us a limited license to store and process your data solely for the purpose of providing the service.
              </p>
            </div>
          </section>

          {/* Section 05 */}
          <section>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-[#c8ff00] text-xs uppercase tracking-widest">05</span>
              <h2 className="text-2xl font-bold">Email Reminders</h2>
            </div>
            <div className="border-t border-white/10 pt-6 text-white/70 leading-relaxed space-y-4">
              <p>
                By using SubTrack and adding subscriptions with renewal dates, you consent to receive email reminders about upcoming charges. You can disable these notifications at any time in your account settings.
              </p>
              <p>
                We will never send marketing emails, promotional content, or share your email with third parties for advertising purposes.
              </p>
            </div>
          </section>

          {/* Section 06 */}
          <section>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-[#c8ff00] text-xs uppercase tracking-widest">06</span>
              <h2 className="text-2xl font-bold">Disclaimer</h2>
            </div>
            <div className="border-t border-white/10 pt-6 text-white/70 leading-relaxed space-y-4">
              <p className="text-white font-bold">
                SubTrack is a student portfolio project.
              </p>
              <p>
                This service is provided &quot;as is&quot; without warranties of any kind. We make no guarantees about:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="before:content-['—'] before:mr-3 before:text-[#c8ff00]">Uptime or availability</li>
                <li className="before:content-['—'] before:mr-3 before:text-[#c8ff00]">Accuracy of reminder delivery times</li>
                <li className="before:content-['—'] before:mr-3 before:text-[#c8ff00]">Long-term service continuity</li>
                <li className="before:content-['—'] before:mr-3 before:text-[#c8ff00]">Data backup or recovery</li>
              </ul>
              <p className="text-white/40 text-sm">
                SubTrack is not liable for missed payments, forgotten renewals, or any financial consequences resulting from use of this service.
              </p>
            </div>
          </section>

          {/* Section 07 */}
          <section>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-[#c8ff00] text-xs uppercase tracking-widest">07</span>
              <h2 className="text-2xl font-bold">Termination</h2>
            </div>
            <div className="border-t border-white/10 pt-6 text-white/70 leading-relaxed space-y-4">
              <p>
                We reserve the right to terminate or suspend access to SubTrack at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
              <p>
                You may delete your account at any time. Upon deletion, all your data will be permanently removed within 30 days.
              </p>
            </div>
          </section>

          {/* Section 08 */}
          <section>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-[#c8ff00] text-xs uppercase tracking-widest">08</span>
              <h2 className="text-2xl font-bold">Contact</h2>
            </div>
            <div className="border-t border-white/10 pt-6 text-white/70 leading-relaxed space-y-4">
              <p>
                Questions about these terms? Email us at{" "}
                <a href="mailto:ameyasingh619@gmail.com" className="text-[#c8ff00] hover:underline">
                  ameyasingh619@gmail.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <p className="text-white/40 text-sm">
              © 2026 SubTrack
            </p>
            <div className="flex gap-8">
              <Link href="/" className="text-white/60 text-sm hover:text-[#c8ff00] transition-colors">
                Home
              </Link>
              <Link href="/privacy" className="text-white/60 text-sm hover:text-[#c8ff00] transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
