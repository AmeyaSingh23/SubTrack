import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyUnsubscribeToken } from "@/lib/tokens";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  if (!userId || !token) {
    return new NextResponse("Invalid link", { status: 400 });
  }

  if (!verifyUnsubscribeToken(userId, token)) {
    return new NextResponse("Invalid or expired link", { status: 403 });
  }

  await db.user.update({
    where: { id: userId },
    data: { emailRemindersEnabled: false },
  });

  // Redirect to a simple confirmation page
  return NextResponse.redirect(
    new URL("/reminders/unsubscribed", req.url)
  );
}