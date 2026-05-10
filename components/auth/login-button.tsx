"use client";
import { signIn } from "next-auth/react";

export function LoginButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="group relative w-full flex items-center justify-center gap-3 
                 bg-white text-black font-bold text-sm uppercase tracking-widest
                 px-6 py-4 transition-all duration-300
                 hover:bg-[#c8ff00]
                 before:absolute before:inset-0 before:border-2 before:border-white/20
                 before:translate-x-1 before:translate-y-1 before:-z-10
                 hover:before:border-[#c8ff00]/40
                 hover:before:translate-x-2 hover:before:translate-y-2
                 before:transition-all before:duration-300"
    >
      <svg width="16" height="16" viewBox="0 0 18 18">
        <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
        <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.53H1.83v2.07A8 8 0 0 0 8.98 17z"/>
        <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
        <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
      </svg>
      Continue with Google
    </button>
  );
}