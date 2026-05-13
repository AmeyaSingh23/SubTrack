// middleware.ts
// Next.js middleware runs BEFORE a request reaches your page or API route.
// It's like a security checkpoint at the entrance of a building.
// Middleware runs on the "Edge Runtime" — a lightweight
// environment that runs geographically close to the user (not on your main
// server). This makes auth checks extremely fast because the user gets
// redirected BEFORE any database queries or page rendering happens.

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth; // req.auth is null if not logged in
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isOnSubscriptions = req.nextUrl.pathname.startsWith("/subscriptions");

  const isProtected = isOnDashboard || isOnSubscriptions;

  if (isProtected && !isLoggedIn) {
    // User tried to visit a protected page without being logged in.
    // Redirect them to /login, and remember where they were trying to go
    // so we can send them there after they successfully log in.
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && req.nextUrl.pathname === "/login") {
    // User is already logged in but somehow ended up at /login.
    // Send them to the dashboard instead.
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  return NextResponse.next(); // All good, let the request through
});

export const config = {
  // This tells Next.js WHICH routes to run middleware on.
  // We exclude static files, images, and the auth API routes themselves
  // because those should never be blocked.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};