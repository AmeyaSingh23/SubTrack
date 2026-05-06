// auth.ts (in project root, NOT inside app/ or lib/)
// This is the single source of truth for all authentication logic.

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // The adapter connects Auth.js to your database.
  // When a user logs in for the first time, Auth.js will automatically
  // CREATE a row in your User table and Account table. You write zero SQL.
  adapter: PrismaAdapter(db),

  providers: [
    // This tells Auth.js "allow users to log in with Google"
    // It automatically reads AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET from .env
    Google,
  ],

  pages: {
    // Instead of Auth.js's default ugly login page,
    // send users to OUR custom login page (we'll build this next)
    signIn: "/login",
  },

  callbacks: {
    // The session callback controls what data is available to your
    // frontend when it calls auth() to check who's logged in.
    // By default, session.user doesn't include the user's ID.
    // We add it manually here because we'll need it to query
    // "give me subscriptions WHERE userId = session.user.id"
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});