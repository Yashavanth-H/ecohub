// src/app/(app)/home/page.tsx
export default function HomePage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome Back!
      </h1>
      <p className="text-gray-600 mb-8">
        Here's a quick overview of your marketplace activity.
      </p>

      {/* Placeholder for dashboard widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg">Items for Sale</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg">Messages</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">3</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg">Account Health</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">Excellent</p>
        </div>
      </div>
    </div>
  );
}