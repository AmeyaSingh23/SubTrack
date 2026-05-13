// This is a Next.js API Route.
// The [...nextauth] folder name is a "catch-all segment" — it means
// this single file handles ALL of these URLs:
//   /api/auth/signin
//   /api/auth/signout
//   /api/auth/callback/google
//   /api/auth/session
//   ...and more
//
// We just re-export the handlers Auth.js already built for us in auth.ts.
// Auth.js does all the heavy lifting — we just wire it into Next.js's routing.

import { handlers } from "@/auth";

export const { GET, POST } = handlers;