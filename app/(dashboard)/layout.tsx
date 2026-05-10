// app/(dashboard)/layout.tsx
// This layout wraps ALL dashboard pages automatically.
// Any page inside (dashboard)/ gets the sidebar for free.

import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0f0f0f] overflow-hidden">
      <Sidebar />
      {/* Main content area scrolls independently of sidebar */}
      <main className="flex-1 overflow-y-auto bg-[#f7f6f3]">
        {children}
      </main>
    </div>
  );
}