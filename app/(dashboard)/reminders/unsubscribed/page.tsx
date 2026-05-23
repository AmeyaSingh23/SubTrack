export default function UnsubscribedPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="text-center max-w-md px-8">
        <p className="font-mono text-[10px] text-[#c8ff00] uppercase tracking-[0.4em] mb-4">
          SubTrack / Email Preferences
        </p>

        <h1 className="text-3xl font-black tracking-tight mb-3">
          You're unsubscribed
        </h1>

        <p className="font-mono text-sm text-white/40 mb-8">
          You won't receive any more reminder emails from SubTrack.
          You can re-enable them anytime from your profile.
        </p>

        <a
          href="/profile"
          className="font-mono text-[11px] text-[#c8ff00] uppercase tracking-widest hover:text-white transition-colors"
        >
          Go to Profile →
        </a>
      </div>
    </div>
  );
}