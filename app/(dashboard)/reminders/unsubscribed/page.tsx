export default function UnsubscribedPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] flex items-center justify-center">
      <div className="text-center max-w-md px-8">
        <p className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-[0.4em] mb-4">
          SubTrack / Email Preferences
        </p>

        <h1 className="text-3xl font-black tracking-tight mb-3">
          You're unsubscribed
        </h1>

        <p className="font-mono text-sm text-[var(--text-secondary)] mb-8">
          You won't receive any more reminder emails from SubTrack.
          You can re-enable them anytime from your profile.
        </p>

        <a
          href="/profile"
          className="font-mono text-[11px] text-[var(--accent)] uppercase tracking-widest hover:text-[var(--text-primary)] transition-colors"
        >
          Go to Profile →
        </a>
      </div>
    </div>
  );
}
