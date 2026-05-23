import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  sendReminderEmail,
  sendDueTodayEmail,
  sendOverdueNudgeEmail,
} from "@/lib/email";
import { generateReminderToken } from "@/lib/tokens";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const isValidToken = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";

  if (!isValidToken && !isVercelCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    // Start and end of today (midnight to 11:59pm)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Start and end of the day 2 days from now
    const twoDaysFromNow = new Date(now);
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    const startOfTwoDays = new Date(twoDaysFromNow.getFullYear(), twoDaysFromNow.getMonth(), twoDaysFromNow.getDate());
    const endOfTwoDays = new Date(twoDaysFromNow.getFullYear(), twoDaysFromNow.getMonth(), twoDaysFromNow.getDate(), 23, 59, 59, 999);

    // 3 days ago — subscriptions overdue past this point get the nudge email
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const results = {
      reminder: { sent: 0, failed: 0 },
      due_today: { sent: 0, failed: 0 },
      overdue_nudge: { sent: 0, failed: 0 },
    };

    // ── QUERY 1: 2-day reminders ──────────────────────────────────────
    // Find active subs billing in exactly 2 days
    // that haven't received a "reminder" type email yet today
    // and whose user has email reminders enabled
    const reminderSubs = await db.subscription.findMany({
      where: {
        isActive: true,
        nextBillingDate: { gte: startOfTwoDays, lte: endOfTwoDays },
        user: { is: { emailRemindersEnabled: true } },
        // "none" means: no ReminderLog of type "reminder" sent today exists
        reminderLogs: {
          none: {
            type: "reminder",
            sentAt: { gte: startOfToday },
          },
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    for (const sub of reminderSubs) {
      try {
        await sendReminderEmail({
          to: sub.user.email!,
          userId: sub.user.id,
          subscriptionName: sub.name,
          amount: sub.amount,
          currency: sub.currency,
          billingDate: sub.nextBillingDate,
        });
        // Log it so we don't send it again
        await db.reminderLog.create({
          data: {
            userId: sub.userId,
            subscriptionId: sub.id,
            subscriptionName: sub.name,
            amount: sub.amount,
            currency: sub.currency,
            billingDate: sub.nextBillingDate,
            type: "reminder",
          },
        });
        await db.subscription.update({
          where: { id: sub.id },
          data: { lastNotifiedAt: now },
        });
        results.reminder.sent++;
      } catch (err) {
        console.error(`Reminder email failed for ${sub.name}:`, err);
        results.reminder.failed++;
      }
    }

    // ── QUERY 2: due today ────────────────────────────────────────────
    // Find active subs whose billing date is today
    // that haven't received a "due_today" email yet today
    const dueTodaySubs = await db.subscription.findMany({
      where: {
        isActive: true,
        nextBillingDate: { gte: startOfToday, lte: endOfToday },
        user: { is: {emailRemindersEnabled: true } },
        reminderLogs: {
          none: {
            type: "due_today",
            sentAt: { gte: startOfToday },
          },
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    for (const sub of dueTodaySubs) {
      try {
        await sendDueTodayEmail({
          to: sub.user.email!,
          userId: sub.user.id,
          subscriptionName: sub.name,
          amount: sub.amount,
          currency: sub.currency,
          billingDate: sub.nextBillingDate,
        });
        await db.reminderLog.create({
          data: {
            userId: sub.userId,
            subscriptionId: sub.id,
            subscriptionName: sub.name,
            amount: sub.amount,
            currency: sub.currency,
            billingDate: sub.nextBillingDate,
            type: "due_today",
          },
        });
        results.due_today.sent++;
      } catch (err) {
        console.error(`Due today email failed for ${sub.name}:`, err);
        results.due_today.failed++;
      }
    }

    // ── QUERY 3: overdue nudge ────────────────────────────────────────
    // Find active subs that are 3+ days past their billing date
    // and have never received an "overdue_nudge" email
    // We ask the user: did you cancel, or did you renew?
    const overdueSubs = await db.subscription.findMany({
      where: {
        isActive: true,
        nextBillingDate: { lt: threeDaysAgo },
        user: { is: {emailRemindersEnabled: true } },
        // "none" with no sentAt filter = never sent one ever
        reminderLogs: {
          none: { type: "overdue_nudge" },
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    for (const sub of overdueSubs) {
      try {
        // Generate a secure token if this sub doesn't have one yet.
        // This token is embedded in the cancel link in the email.
        // When user clicks "Yes I cancelled", the API route verifies
        // this token before doing anything to the DB.
        const token = sub.reminderToken ?? generateReminderToken();
        if (!sub.reminderToken) {
          await db.subscription.update({
            where: { id: sub.id },
            data: { reminderToken: token },
          });
        }

        await sendOverdueNudgeEmail({
          to: sub.user.email!,
          userId: sub.user.id,
          subscriptionId: sub.id,
          subscriptionName: sub.name,
          amount: sub.amount,
          currency: sub.currency,
          billingDate: sub.nextBillingDate,
          reminderToken: token,
        });
        await db.reminderLog.create({
          data: {
            userId: sub.userId,
            subscriptionId: sub.id,
            subscriptionName: sub.name,
            amount: sub.amount,
            currency: sub.currency,
            billingDate: sub.nextBillingDate,
            type: "overdue_nudge",
          },
        });
        results.overdue_nudge.sent++;
      } catch (err) {
        console.error(`Overdue nudge failed for ${sub.name}:`, err);
        results.overdue_nudge.failed++;
      }
    }

    console.log("Cron ran:", results);

    return NextResponse.json({ success: true, results });

  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}