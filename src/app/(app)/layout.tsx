// src/app/(app)/layout.tsx
import DashboardNav from '@/components/dashboard/DashboardNav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <DashboardNav />
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}