import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Fetch fresh user data from DB — session may be stale
  const user = await db.user.findUnique({
    where: { id: session.user!.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      _count: {
        select: { subscriptions: true },
      },
    },
  });

  const activeSubscriptions = await db.subscription.findMany({
    where: { userId: session.user!.id, isActive: true },
  });

  const monthlyTotal = activeSubscriptions.reduce((sum: number, sub: any) => {
    if (sub.billingCycle === "monthly") return sum + sub.amount;
    if (sub.billingCycle === "yearly") return sum + sub.amount / 12;
    if (sub.billingCycle === "weekly") return sum + (sub.amount * 52) / 12;
    return sum;
  }, 0);

  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="px-8 pt-8 pb-6 border-b border-white/6">
        <p className="font-mono text-[10px] text-[#c8ff00] uppercase tracking-[0.4em] mb-1">
          SubTrack / Profile
        </p>
        <h1 className="text-3xl font-black tracking-[-0.04em]">
          Your Profile
        </h1>
      </div>

      <div className="px-8 py-8">
        <ProfileForm user={user} monthlyTotal={monthlyTotal} />
      </div>
    </main>
  );
}