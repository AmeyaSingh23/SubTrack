// app/actions/profile.ts
"use server";

import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateUserName(name: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (!name.trim()) throw new Error("Name cannot be empty");

  await db.user.update({
    where: { id: session.user.id },
    data: { name: name.trim() },
  });

  // Revalidate dashboard so greeting updates immediately
  revalidatePath("/dashboard");
  revalidatePath("/profile");
}

export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Delete user — Prisma cascades to subscriptions, accounts,
  // sessions, and reminderLogs automatically (onDelete: Cascade)
  await db.user.delete({
    where: { id: session.user.id },
  });

  // Sign out and redirect to landing page
  await signOut({ redirectTo: "/" });
}