// app/(auth)/login/page.tsx
// This is a SERVER COMPONENT (no "use client" at the top).
// It renders the login page shell on the server.
// The actual "Sign in with Google" button needs to be a Client Component
// because it calls a server action on click — we'll put that in a
// separate component below.

import { LoginButton } from "@/components/auth/login-button";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SubTrack</h1>
          <p className="text-gray-500 mt-2">
            Take control of your subscriptions
          </p>
        </div>

        {/* Feature bullets — reminds user why they're signing up */}
        <ul className="space-y-3 mb-8 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Track all your recurring charges in one place
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Get alerted 48 hours before any bill hits
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Never forget a free trial again
          </li>
        </ul>

        {/* The actual sign-in button — lives in its own Client Component */}
        <LoginButton />

        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in, you agree to our Terms of Service.
          We never share your data.
        </p>
      </div>
    </main>
  );
}