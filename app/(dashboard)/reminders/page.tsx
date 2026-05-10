import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function RemindersPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const logs = await db.reminderLog.findMany({
    where: { userId: session.user!.id },
    orderBy: { sentAt: "desc" },
    take: 50,
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="px-8 pt-8 pb-6 border-b border-white/6">
        <p className="font-mono text-[10px] text-[#c8ff00] uppercase tracking-[0.4em] mb-1">
          SubTrack / Reminders
        </p>
        <h1 className="text-3xl font-black tracking-[-0.04em]">
          Email History
        </h1>
        <p className="font-mono text-[11px] text-white/20 uppercase tracking-widest mt-2">
          All reminder emails sent to {session.user?.email}
        </p>
      </div>

      <div className="px-8 py-8 max-w-2xl">
        {logs.length === 0 ? (
          <div className="border border-white/6 p-12 text-center">
            <p className="font-mono text-[11px] text-white/20 uppercase tracking-widest">
              No reminders sent yet
            </p>
            <p className="font-mono text-[10px] text-white/10 mt-2">
              Emails are sent 48 hours before billing dates
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-white/6">
            {logs.map((log: any) => {
              const billingDate = new Date(log.billingDate);
              const sentAt = new Date(log.sentAt);

              return (
                <li
                  key={log.id}
                  className="py-5 flex items-start justify-between gap-6"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-6 h-6 flex items-center justify-center
                                      border border-white/8 font-mono text-[10px]
                                      text-white/30">
                        {log.subscriptionName[0].toUpperCase()}
                      </div>
                      <p className="font-bold text-sm text-white/80">
                        {log.subscriptionName}
                      </p>
                      <span className="font-mono text-[11px] text-[#c8ff00]">
                        {log.currency} {log.amount}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest ml-9">
                      Billing on{" "}
                      {billingDate.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
                      Sent
                    </p>
                    <p className="font-mono text-[11px] text-white/40 mt-0.5">
                      {sentAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="font-mono text-[10px] text-white/20 mt-0.5">
                      {sentAt.toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Email preferences */}
        <div className="mt-10 border-t border-white/6 pt-6">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-2">
            Email Preferences
          </p>
          <p className="font-mono text-xs text-white/20 leading-relaxed">
            Reminder emails are sent to{" "}
            <span className="text-white/40">{session.user?.email}</span>{" "}
            48 hours before each billing date. To stop receiving reminders,
            remove the subscription from SubTrack or delete your account.
          </p>
        </div>
      </div>
    </main>
  );
}