import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendReminderEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const isValidToken = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";

  if (!isValidToken && !isVercelCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const upcomingSubscriptions = await db.subscription.findMany({
      where: {
        isActive: true,
        nextBillingDate: {
          gte: startOfToday,
          lte: in48Hours,
        },
        // Only notify if never notified OR last notified before today
        // This prevents duplicate emails within the same billing cycle
        OR: [
          { lastNotifiedAt: null },
          { lastNotifiedAt: { lt: startOfToday } },
        ],
      },
      include: {
        user: {
          select: { name: true, email: true },
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

    // Get only the successfully sent ones
    const successfullySent = upcomingSubscriptions.filter(
      (_, i) => results[i].status === "fulfilled"
    );

    // Log to ReminderLog table
    if (successfullySent.length > 0) {
      await db.reminderLog.createMany({
        data: successfullySent.map((sub) => ({
          userId: sub.userId,
          subscriptionId: sub.id,
          subscriptionName: sub.name,
          amount: sub.amount,
          currency: sub.currency,
          billingDate: sub.nextBillingDate,
        })),
      });

      // Mark each sub as notified so we don't email again this cycle
      await Promise.all(
        successfullySent.map((sub) =>
          db.subscription.update({
            where: { id: sub.id },
            data: { lastNotifiedAt: now },
          })
        )
      );
    }

    const succeeded = successfullySent.length;
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}