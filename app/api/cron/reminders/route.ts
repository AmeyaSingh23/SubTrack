// app/api/cron/reminders/route.ts
// This is a Next.js API Route that acts as our cron job endpoint.
// When called, it:
//   1. Verifies the request is from our cron service (not a random person)
//   2. Finds all subscriptions due in the next 48 hours
//   3. Sends a reminder email for each one
//   4. Returns a summary of what was sent

import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { sendReminderEmail } from "@/lib/email";

type UpcomingReminderSubscription = Prisma.SubscriptionGetPayload<{
  include: {
    user: {
      select: {
        name: true;
        email: true;
      };
    };
  };
}>;

export async function GET(request: NextRequest) {
  // SECURITY: Verify the request has our secret token.
  // Without this check, ANYONE could trigger mass emails by hitting this URL.
  // The cron service will send this token in the Authorization header.
  const authHeader = request.headers.get("authorization");
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Calculate the 48-hour window
    const now = new Date();
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    // Find all active subscriptions due in the next 48 hours,
    // and include the owner's user data (name + email) for the email.
    // This is a Prisma "include" — it's like a SQL JOIN.
    const upcomingSubscriptions: UpcomingReminderSubscription[] =
      await db.subscription.findMany({
      where: {
        isActive: true,
        nextBillingDate: {
          gte: now,       // Greater than or equal to now
          lte: in48Hours, // Less than or equal to 48hrs from now
        },
      },
      include: {
        user: {           // JOIN with the User table to get email + name
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Send an email for each subscription found
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

    // Promise.allSettled runs all emails in parallel and collects results.
    // Unlike Promise.all, it doesn't stop if one email fails —
    // a failure for one user shouldn't block emails for everyone else.
    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log(`Cron ran: ${succeeded} emails sent, ${failed} failed`);

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
