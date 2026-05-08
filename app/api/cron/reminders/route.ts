// app/api/cron/reminders/route.ts
// This route is called automatically by Vercel Cron every day.
// It:
//   1. Verifies the request is authorized
//   2. Finds subscriptions due in the next 48 hours
//   3. Sends reminder emails
//   4. Returns a summary response

import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import { sendReminderEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  // SECURITY CHECK
  // Accept either:
  // 1. Manual CRON_SECRET auth (for local testing)
  // 2. Vercel Cron automatic header in production

  const authHeader = request.headers.get("authorization");

  const isValidToken =
    authHeader === `Bearer ${process.env.CRON_SECRET}`;

  const isVercelCron =
    request.headers.get("x-vercel-cron") === "1";

  if (!isValidToken && !isVercelCron) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Current time
    const now = new Date();

    // Start of TODAY in local/server time
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // 48 hours from now
    const in48Hours = new Date(
      now.getTime() + 48 * 60 * 60 * 1000
    );

    // Find subscriptions due within next 48 hours
    const upcomingSubscriptions: Prisma.SubscriptionGetPayload<{
      include: {
        user: {
          select: {
            name: true;
            email: true;
          };
        };
      };
    }>[] = await db.subscription.findMany({
      where: {
        isActive: true,
        nextBillingDate: {
          gte: startOfToday,
          lte: in48Hours,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Send all reminder emails in parallel
    const results = await Promise.allSettled(
      upcomingSubscriptions.map((sub) =>
        sendReminderEmail({
          to: sub.user.email!,
          userName: sub.user.name ?? "there",
          subscriptionName: sub.name,
          amount: sub.amount,
          currency: sub.currency,
          billingDate: sub.nextBillingDate,
          cancelUrl: sub.cancelUrl,
          isTrial: sub.isTrial,
        })
      )
    );
    
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Email send failed:", result.reason);
      }
    });

    // Count successes/failures
    const succeeded = results.filter(
      (r) => r.status === "fulfilled"
    ).length;

    const failed = results.filter(
      (r) => r.status === "rejected"
    ).length;

    console.log(
      `Cron ran: ${succeeded} emails sent, ${failed} failed`
    );

    return NextResponse.json({
      success: true,
      emailsSent: succeeded,
      emailsFailed: failed,
      totalFound: upcomingSubscriptions.length,
    });
  } catch (error) {
    console.error("Cron job failed:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}