import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  if (!token || !id) {
    return new NextResponse("Invalid link", { status: 400 });
  }

  const sub = await db.subscription.findFirst({
    where: { id },
  });

  if (!sub) {
    return new NextResponse("Invalid or expired link", { status: 403 });
  }

  // Token must match for active subscriptions
  if (sub.reminderToken !== token) {
    return new NextResponse("Invalid or expired link", { status: 403 });
  }

  // Auto-advance nextBillingDate by one billing cycle
  const nextDate = new Date(sub.nextBillingDate);
  if (sub.billingCycle === "weekly") {
    nextDate.setDate(nextDate.getDate() + 7);
  } else if (sub.billingCycle === "yearly") {
    nextDate.setFullYear(nextDate.getFullYear() + 1);
  } else {
    // monthly (default)
    nextDate.setMonth(nextDate.getMonth() + 1);
  }

  await db.subscription.update({
    where: { id },
    data: {
      nextBillingDate: nextDate,
      reminderToken: null, // invalidate token after use
    },
  });

  // Redirect to detail page so user can adjust if they changed plans
  return NextResponse.redirect(
    new URL(`/subscriptions/${id}?renewed=true`, req.url)
  );
}
