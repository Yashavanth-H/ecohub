// src/app/(app)/favorites/page.tsx
import FavoritesClientPage from '@/components/favorites/FavoritesClientPage';

export default function FavoritesPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        My Favorites
      </h1>
      <FavoritesClientPage />
    </div>
  );
}