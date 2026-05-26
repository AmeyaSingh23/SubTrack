import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[var(--bg)] overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto bg-[var(--bg)] pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
