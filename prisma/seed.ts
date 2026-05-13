// A seed script populates your database with fake data for development.
// It runs once manually — it's NOT part of the app.
// Replace the userId with actual user ID from Prisma Studio.

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  // ⚠️ IMPORTANT: Replace this with actual user ID from Prisma Studio
  // Open Prisma Studio → User table → copy the "id" value of your user
  const YOUR_USER_ID = "PASTE_YOUR_USER_ID_HERE";

  // Delete existing subscriptions for a clean seed
  await db.subscription.deleteMany({ where: { userId: YOUR_USER_ID } });

  await db.subscription.createMany({
    data: [
      {
        name: "Netflix",
        amount: 649,
        currency: "INR",
        billingCycle: "monthly",
        nextBillingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        category: "Streaming",
        cancelUrl: "https://netflix.com/cancel",
        isTrial: false,
        userId: YOUR_USER_ID,
      },
      {
        name: "Spotify",
        amount: 119,
        currency: "INR",
        billingCycle: "monthly",
        nextBillingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
        category: "Music",
        cancelUrl: "https://spotify.com/account",
        isTrial: false,
        userId: YOUR_USER_ID,
      },
      {
        name: "GitHub Copilot",
        amount: 833,
        currency: "INR",
        billingCycle: "monthly",
        nextBillingDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days
        category: "Work",
        cancelUrl: "https://github.com/settings/copilot",
        isTrial: true,
        trialEndDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        userId: YOUR_USER_ID,
      },
      {
        name: "Notion",
        amount: 1600,
        currency: "INR",
        billingCycle: "yearly",
        nextBillingDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
        category: "Work",
        cancelUrl: "https://notion.so/settings",
        isTrial: false,
        userId: YOUR_USER_ID,
      },
      {
        name: "YouTube Premium",
        amount: 189,
        currency: "INR",
        billingCycle: "monthly",
        nextBillingDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow!
        category: "Streaming",
        cancelUrl: "https://youtube.com/paid_memberships",
        isTrial: false,
        userId: YOUR_USER_ID,
      },
    ],
  });

  console.log("✅ Seeded 5 subscriptions successfully");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());