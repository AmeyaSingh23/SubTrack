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
    where: { id, reminderToken: token },
  });

  if (!sub) {
    return new NextResponse("Invalid or expired link", { status: 403 });
  }

  await db.subscription.update({
    where: { id },
    data: {
      isActive: false,
      reminderToken: null, // invalidate token after use
    },
  });

  return NextResponse.redirect(
    new URL("/subscriptions?cancelled=true", req.url)
  );
}