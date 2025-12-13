// src/app/(app)/layout.tsx
import DashboardNav from '@/components/dashboard/DashboardNav';
import { UserActivityProvider } from '@/context/UserActivityContext';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserActivityProvider>
    <div className="bg-gray-50 min-h-screen">
      <DashboardNav />
      <main className="w-full">
        {children}
      </main>
    </div>
    </UserActivityProvider>
  );
}