// app/actions/subscriptions.ts
"use server";
// ↑ This directive tells Next.js: "every function exported from this
// file runs on the server only." The client never sees this code.
// If you accidentally log a DB password here, it won't leak to the browser.

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createSubscription(
    _prevState: unknown,
    formData: FormData) {
  // Step 1: Verify the user is logged in
  // Never trust that only logged-in users will call this —
  // always re-verify on the server. This is called "server-side authorization."
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Step 2: Extract and parse form data
  // FormData is the browser's native way of packaging form fields.
  // .get() returns the value of a field by its "name" attribute.
  const name = formData.get("name") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const currency = formData.get("currency") as string;
  const billingCycle = formData.get("billingCycle") as string;
  const nextBillingDate = new Date(formData.get("nextBillingDate") as string);
  const category = formData.get("category") as string;
  const cancelUrl = formData.get("cancelUrl") as string;
  const isTrial = formData.get("isTrial") === "on";
  const trialEndDateRaw = formData.get("trialEndDate") as string;
  const trialEndDate = trialEndDateRaw ? new Date(trialEndDateRaw) : null;

  // Step 3: Basic validation
  // Never trust data coming from the client — always validate on the server.
  if (!name || !amount || !billingCycle || !nextBillingDate || !category) {
    throw new Error("Missing required fields");
  }

  // Step 4: Write to database
  await db.subscription.create({
    data: {
      name,
      amount,
      currency,
      billingCycle,
      nextBillingDate,
      category,
      cancelUrl: cancelUrl || null,
      isTrial,
      trialEndDate,
      userId: session.user.id, // Always use the server session — never trust client-sent userId
    },
  });

  // Step 5: Revalidate the dashboard cache
  // Next.js caches page renders for performance. After adding a subscription,
  // we need to tell Next.js "the dashboard data is stale, re-fetch it."
  // Without this, the user would see the old dashboard until they hard-refresh.
  revalidatePath("/dashboard");

  // Step 6: Redirect back to dashboard
  redirect("/dashboard");
}