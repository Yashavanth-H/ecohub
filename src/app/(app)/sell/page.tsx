import { SellForm } from '@/components/sell/SellForm'; 

export default function SellPage() {
  return (

    <div className="min-h-screen bg-gray-50 py-8 flex justify-center">
      <div className="w-full max-w-lg">
        <SellForm />
      </div>
      
    </div>
  );
}