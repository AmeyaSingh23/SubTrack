// This file contains all email-related logic.
// Nodemailer is a Node.js library that sends emails via SMTP.
// SMTP (Simple Mail Transfer Protocol) is the standard protocol
// that email servers use to send mail — like a postal service for email.

import nodemailer from "nodemailer";
import { generateUnsubscribeToken } from "./tokens";

// A "transporter" is Nodemailer's term for the configured email sender.
// We create ONE transporter and reuse it (same singleton pattern as Prisma).
// It holds your SMTP credentials and knows HOW to send emails.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD, // The App Password, not your real Gmail password
  },
});

// BASE_URL is the root of your app — used to build links inside emails.
// e.g. https://subtrack.vercel.app
// The "!" tells TypeScript "trust me, this env var exists"
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!;

// Generates a one-click unsubscribe link for a specific user.
// The token is an HMAC — a cryptographic signature derived from the userId.
// This means we don't need to store it in the DB — we just re-derive
// and compare when the user clicks the link.
function unsubscribeLink(userId: string): string {
  const token = generateUnsubscribeToken(userId);
  return `${BASE_URL}/api/reminders/unsubscribe?userId=${userId}&token=${token}`;
}

// Every email gets this footer — keeps us CAN-SPAM compliant
// and gives users a way out without going to settings.
function footer(userId: string): string {
  return `
    <div style="margin-top:32px;padding-top:16px;border-top:1px solid #222;
                font-family:monospace;font-size:11px;color:#444;">
      You're receiving this because you have an active SubTrack account.<br/>
      <a href="${unsubscribeLink(userId)}" style="color:#666;">
        Unsubscribe from reminder emails
      </a>
    </div>
  `;
}

// ── EMAIL 1: 2 days before renewal ─────────────────────────────────
// Sent when nextBillingDate is exactly 2 days away.
// Gives the user time to cancel if they don't want to be charged.
export async function sendReminderEmail({
  to,
  userId,
  subscriptionName,
  amount,
  currency,
  billingDate,
}: {
  to: string;
  userId: string;
  subscriptionName: string;
  amount: number;
  currency: string;
  billingDate: Date;
}) {
  const dateStr = new Date(billingDate).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  // .sendMail() is the actual function that sends the email.
  // It returns a Promise — we await it so we know if it succeeded or failed.
  await transporter.sendMail({
    from: `"SubTrack" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `[SubTrack] ${subscriptionName} renews in 2 days — ${currency} ${amount}`,
    html: `
      <div style="background:#0a0a0a;color:#fff;padding:32px;font-family:monospace;">
        <p style="color:#c8ff00;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;">
          SubTrack / Reminder
        </p>
        <h1 style="font-size:24px;font-weight:900;margin:8px 0;">
          ${subscriptionName} renews in 2 days
        </h1>
        <p style="color:#888;font-size:14px;">
          ${currency} ${amount} will be charged on
          <strong style="color:#fff;">${dateStr}</strong>
        </p>
        <a href="${BASE_URL}/subscriptions"
           style="display:inline-block;margin-top:24px;padding:10px 20px;
                  background:#c8ff00;color:#000;font-weight:700;
                  font-family:monospace;text-decoration:none;font-size:13px;">
          View Subscription →
        </a>
        ${footer(userId)}
      </div>
    `,
  });
}

// ── EMAIL 2: due today ──────────────────────────────────────────────
// Sent on the exact day of nextBillingDate.
// More urgent tone — charge is happening today.
export async function sendDueTodayEmail({
  to,
  userId,
  subscriptionName,
  amount,
  currency,
  billingDate,
}: {
  to: string;
  userId: string;
  subscriptionName: string;
  amount: number;
  currency: string;
  billingDate: Date;
}) {
  const dateStr = new Date(billingDate).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  await transporter.sendMail({
    from: `"SubTrack" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `[SubTrack] ${subscriptionName} renews today — ${currency} ${amount}`,
    html: `
      <div style="background:#0a0a0a;color:#fff;padding:32px;font-family:monospace;">
        <p style="color:#c8ff00;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;">
          SubTrack / Due Today
        </p>
        <h1 style="font-size:24px;font-weight:900;margin:8px 0;">
          ${subscriptionName} renews today
        </h1>
        <p style="color:#888;font-size:14px;">
          ${currency} ${amount} is being charged today,
          <strong style="color:#fff;">${dateStr}</strong>
        </p>
        <a href="${BASE_URL}/subscriptions"
           style="display:inline-block;margin-top:24px;padding:10px 20px;
                  background:#c8ff00;color:#000;font-weight:700;
                  font-family:monospace;text-decoration:none;font-size:13px;">
          View Subscription →
        </a>
        ${footer(userId)}
      </div>
    `,
  });
}

// ── EMAIL 3: overdue nudge ──────────────────────────────────────────
// Sent 3 days AFTER nextBillingDate if the subscription is still marked active.
// At this point we don't know if they renewed or cancelled — so we ask.
// Two CTA buttons:
//   "Yes I cancelled" → hits /api/subscriptions/cancel-via-email with a token
//                       → sets isActive: false in DB automatically
//   "No I renewed"   → takes them to the detail page to update the billing date
//
// The reminderToken is a random string stored on the subscription row.
// It's used to verify the cancel link — so random people can't cancel
// your subscriptions by guessing URLs.
export async function sendOverdueNudgeEmail({
  to,
  userId,
  subscriptionId,
  subscriptionName,
  amount,
  currency,
  billingDate,
  reminderToken,
}: {
  to: string;
  userId: string;
  subscriptionId: string;
  subscriptionName: string;
  amount: number;
  currency: string;
  billingDate: Date;
  reminderToken: string;
}) {
  const dateStr = new Date(billingDate).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  // Cancel link hits our API route with the token — no login needed.
  // Token is verified server-side before any DB write happens.
  const cancelLink = `${BASE_URL}/api/subscriptions/cancel-via-email?token=${reminderToken}&id=${subscriptionId}`;

  // Renewed link hits our API route — auto-advances the billing date
  // by one cycle, then redirects to the detail page where the user
  // can adjust if they changed plans (e.g. monthly → yearly).
  const renewedLink = `${BASE_URL}/api/subscriptions/renew-via-email?token=${reminderToken}&id=${subscriptionId}`;

  await transporter.sendMail({
    from: `"SubTrack" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `[SubTrack] Did you cancel ${subscriptionName}?`,
    html: `
      <div style="background:#0a0a0a;color:#fff;padding:32px;font-family:monospace;">
        <p style="color:#c8ff00;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;">
          SubTrack / Action Needed
        </p>
        <h1 style="font-size:24px;font-weight:900;margin:8px 0;">
          Did you cancel ${subscriptionName}?
        </h1>
        <p style="color:#888;font-size:14px;">
          Your ${subscriptionName} subscription was due on
          <strong style="color:#fff;">${dateStr}</strong> and hasn't been updated.
          Let us know so your analytics stay accurate.
        </p>

        <div style="margin-top:24px;">
          <a href="${cancelLink}"
             style="display:inline-block;padding:10px 20px;
                    background:#ff4444;color:#fff;font-weight:700;
                    font-family:monospace;text-decoration:none;font-size:13px;">
            Yes, I cancelled it →
          </a>
          <a href="${renewedLink}"
             style="display:inline-block;padding:10px 20px;margin-left:12px;
                    background:#c8ff00;color:#000;font-weight:700;
                    font-family:monospace;text-decoration:none;font-size:13px;">
            No, I renewed it →
          </a>
        </div>
        ${footer(userId)}
      </div>
    `,
  });
}