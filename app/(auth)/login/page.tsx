"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

function AnimatedGrid() {
  const [activeCell, setActiveCell] = useState<number | null>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCell(Math.floor(Math.random() * 64));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-8 gap-px w-full h-full">
      {Array.from({ length: 64 }).map((_, i) => (
        <div
          key={i}
          className={`transition-all duration-300 ${
            activeCell === i
              ? "bg-[#c8ff00]"
              : i % 7 === 0
              ? "bg-[#c8ff00]/10"
              : "bg-white/2"
          }`}
        />
      ))}
    </div>
  );
}

function GlitchText({ text }: { text: string }) {
  const [glitch, setGlitch] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block">
      <span className={glitch ? "opacity-0" : "opacity-100"}>{text}</span>
      {glitch && (
        <>
          <span className="absolute inset-0 text-[#c8ff00] translate-x-0.5 -translate-y-0.5">
            {text}
          </span>
          <span className="absolute inset-0 text-white/50 -translate-x-0.5 translate-y-0.5">
            {text}
          </span>
        </>
      )}
    </span>
  );
}

export default function LoginPage() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col lg:flex-row">
      {/* Left Panel - Interactive Visual */}
      <div className="h-80 lg:h-auto lg:w-1/2 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 p-8">
          <AnimatedGrid />
        </div>
        
        {/* Brand Mark */}
        <div className="absolute top-8 left-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#c8ff00]" />
            <span className="text-[11px] uppercase tracking-[0.4em] text-white/60">
              SubTrack
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 lg:p-16">
        {/* Mobile Brand */}
        <div className="lg:hidden flex items-center gap-3 mb-12">
          <div className="w-3 h-3 bg-[#c8ff00]" />
          <span className="text-[11px] uppercase tracking-[0.4em] text-white/60">
            SubTrack
          </span>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center max-w-md">
          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#c8ff00] mb-6">
              Authentication Required
            </p>
            <h1 className="text-5xl lg:text-6xl font-light leading-[1.1] tracking-[-0.03em]">
              <GlitchText text="Track" />
              <br />
              <span className="text-white/30">everything.</span>
            </h1>
          </div>

          <p className="text-sm text-white/40 leading-relaxed mb-10 max-w-sm">
            Know exactly where your money goes. Cancel the subscriptions you forgot about.
          </p>

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="group relative w-full flex items-center justify-between
                       bg-white text-[#0a0a0a] text-sm uppercase tracking-[0.2em]
                       px-8 py-5 transition-all duration-300
                       hover:bg-[#c8ff00]"
          >
            <svg width="16" height="16" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.53H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
            </svg>
            <span className="font-medium">Continue with Google</span>
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${isHovering ? 'translate-x-1' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            
            {/* Offset border effect */}
            <div className="absolute inset-0 border-2 border-white/20 translate-x-1 translate-y-1 -z-10 transition-all duration-300 group-hover:border-[#c8ff00]/40" />
          </button>

          <p className="text-[11px] text-white/20 mt-6 uppercase tracking-[0.2em]">
            First time? Your account is created automatically.
          </p>
          <p className="text-[11px] text-white/10 mt-2 uppercase tracking-[0.2em]">
            Join thousands tracking smarter.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-12 border-t border-white/6">
          <div className="flex items-center gap-6">
            <Link 
              href="/privacy" 
              className="text-[10px] uppercase tracking-[0.3em] text-white/30 hover:text-[#c8ff00] transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-[10px] uppercase tracking-[0.3em] text-white/30 hover:text-[#c8ff00] transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
