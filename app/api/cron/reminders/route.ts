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
    const now = new Date();
    
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    
    const in48Hours = new Date(
      now.getTime() + 48 * 60 * 60 * 1000
    );
    
    const upcomingSubscriptions =
      await db.subscription.findMany({
        where: {
          isActive: true,
          nextBillingDate: {
            gte: startOfToday,
            lte: in48Hours,
          },

          OR: [
            {
              lastNotifiedAt: null,
            },
            {
              lastNotifiedAt: {
                lt: startOfToday,
              },
            }
          ]
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
    
    // Create DB logs ONLY for successful emails
    const logsToCreate = upcomingSubscriptions
      .filter((_, i) => results[i].status === "fulfilled")
      .map((sub) => ({
        userId: sub.userId,
        subscriptionId: sub.id,
        subscriptionName: sub.name,
        amount: sub.amount,
        currency: sub.currency,
        billingDate: sub.nextBillingDate,
      }));
    
    if (logsToCreate.length > 0) {
      await db.reminderLog.createMany({
        data: logsToCreate,
      });
    }

    await Promise.all(
      upcomingSubscriptions
        .filter((_, i) => results[i].status === "fulfilled")
        .map((sub) =>
          db.subscription.update({
            where: {
              id: sub.id,
            },
            
            data: {
              lastNotifiedAt: now,
            },
          })
        )
    );

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