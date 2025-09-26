// src/app/(app)/sell/page.tsx
import SellForm from '@/components/sell/SellForm';

export default function SellPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        List a New Item
      </h1>
      <SellForm />
    </div>
  );
}