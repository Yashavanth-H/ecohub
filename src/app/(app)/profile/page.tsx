// src/app/(app)/profile/page.tsx
import UserProfile from '@/components/profile/UserProfile';

export default function ProfilePage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        My Profile
      </h1>
      <UserProfile />
    </div>
  );
}