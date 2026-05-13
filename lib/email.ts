// This file contains all email-related logic.
// Nodemailer is a Node.js library that sends emails via SMTP.
// SMTP (Simple Mail Transfer Protocol) is the standard protocol
// that email servers use to send mail — like a postal service for email.

import nodemailer from "nodemailer";

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

type ReminderEmailProps = {
  to: string;           // Recipient's email
  userName: string;
  subscriptionName: string;
  amount: number;
  currency: string;
  billingDate: Date;
  cancelUrl?: string | null;
  isTrial: boolean;
};

export async function sendReminderEmail({
  to,
  userName,
  subscriptionName,
  amount,
  currency,
  billingDate,
  cancelUrl,
  isTrial,
}: ReminderEmailProps) {
  const formattedDate = new Date(billingDate).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedAmount = `${currency} ${amount.toFixed(0)}`;
  const subject = isTrial
    ? `⚠️ Your ${subscriptionName} trial ends in 48 hours`
    : `🔔 ${subscriptionName} billing in 48 hours — ${formattedAmount}`;

  // This is the HTML email body.
  // Keep it simple — many email clients strip complex CSS.
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #111827; margin-bottom: 4px;">
        ${isTrial ? "⚠️ Trial Ending Soon" : "🔔 Upcoming Charge"}
      </h2>
      <p style="color: #6b7280; margin-top: 0;">SubTrack Reminder</p>

      <div style="background: #f9fafb; border: 1px solid #e5e7eb; 
                  border-radius: 12px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 8px 0; color: #374151;">
          <strong>Hi ${userName},</strong>
        </p>
        <p style="margin: 0; color: #374151;">
          Your <strong>${subscriptionName}</strong> 
          ${isTrial ? "free trial" : "subscription"} 
          ${isTrial ? "ends" : "renews"} on 
          <strong>${formattedDate}</strong>
          ${!isTrial ? ` for <strong>${formattedAmount}</strong>` : ""}.
        </p>
      </div>

      ${cancelUrl ? `
        <p style="color: #374151;">
          Want to cancel before the charge?
        </p>
        <a href="${cancelUrl}" 
           style="display: inline-block; background: #111827; color: white; 
                  padding: 10px 20px; border-radius: 8px; text-decoration: none;
                  font-size: 14px;">
          Cancel ${subscriptionName} →
        </a>
      ` : ""}

      <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">
        This reminder was sent by SubTrack. 
        Log in to manage your subscriptions.
      </p>
    </div>
  `;

  // .sendMail() is the actual function that sends the email.
  // It returns a Promise — we await it so we know if it succeeded or failed.
  await transporter.sendMail({
    from: `"SubTrack" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
}