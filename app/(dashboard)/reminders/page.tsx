import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ServiceLogo } from "@/components/ui/service-logo";

export default async function RemindersPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const logs = await db.reminderLog.findMany({
    where: { userId: session.user!.id },
    orderBy: { sentAt: "desc" },
    take: 50,
  });

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <div className="px-8 pt-8 pb-6 border-b border-[var(--border-subtle)]">
        <p className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-[0.4em] mb-1">
          SubTrack / Reminders
        </p>
        <h1 className="text-3xl font-black tracking-[-0.04em]">
          Email History
        </h1>
        <p className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-widest mt-2">
          All reminder emails sent to {session.user?.email}
        </p>
      </div>

      <div className="px-8 py-8">
        {logs.length === 0 ? (
          <div className="border border-[var(--border-subtle)] p-12 text-center">
            <p className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-widest">
              No reminders sent yet
            </p>
            <p className="font-mono text-[10px] text-[var(--text-faint)] mt-2">
              Emails are sent 48 hours before billing dates
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border-subtle)]">
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
                      <ServiceLogo name={log.subscriptionName} size={28} className="shrink-0 rounded-md" />
                      <p className="font-bold text-sm text-[var(--text-primary)]">
                        {log.subscriptionName}
                      </p>
                      <span className="font-mono text-[11px] text-[var(--accent)]">
                        {log.currency} {log.amount}
                      </span>
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 uppercase tracking-widest border
                          ${log.type === "reminder"
                            ? "border-[var(--border)] text-[var(--text-muted)]"
                            : ""
                          }`}
                        style={
                          log.type === "due_today"
                            ? { borderColor: "var(--warning-border)", color: "var(--warning-text)" }
                            : log.type === "overdue_nudge"
                            ? { borderColor: "var(--danger-border)", color: "var(--danger-text)" }
                            : undefined
                        }
                      >
                        {log.type === "due_today"
                          ? "Due Today"
                          : log.type === "overdue_nudge"
                          ? "Overdue Nudge"
                          : "Reminder"}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest ml-9">
                      Billing on{" "}
                      {billingDate.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                      Sent
                    </p>
                    <p className="font-mono text-[11px] text-[var(--text-secondary)] mt-0.5">
                      {sentAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5">
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
        <div className="mt-10 border-t border-[var(--border-subtle)] pt-6">
          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-2">
            Email Preferences
          </p>
          <p className="font-mono text-xs text-[var(--text-muted)] leading-relaxed">
            Reminder emails are sent to{" "}
            <span className="text-[var(--text-secondary)]">{session.user?.email}</span>{" "}
            You receive an alert 2 days before renewal, again on the due date,
            and a follow-up if a subscription goes overdue.
            Manage your email preferences in{" "}
            <a href="/profile" className="text-[var(--text-secondary)] underline underline-offset-2 hover:text-[var(--text-primary)] transition-colors">
              Profile
            </a>.
          </p>
        </div>
      </div>
    </main>
  );
}
