// app/(dashboard)/layout.tsx
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto bg-[#0a0a0a]">
        {children}
      </main>
    </div>
  );
}