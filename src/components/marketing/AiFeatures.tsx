// src/components/marketing/AiFeatures.tsx
import { FileText, MessageSquare } from 'lucide-react';

const AiFeatures = () => {
  return (
    <section id="features" className="bg-white pt-20 pb-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Powered by AI</h2>
        <p className="text-lg text-gray-600 mb-12">Our smart technology makes recycling easier than ever.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Feature Card 1 */}
          <div className="bg-gray-50 p-8 rounded-xl text-centre">
            {/* Centered Icon Wrapper */}
            <div className="flex justify-center mb-5">
              <FileText className="w-12 h-12 text-green-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Product Categorization</h3>
            <p className="text-gray-600">Our AI model automatically suggests the best category for your listing, ensuring it's seen by the right people.</p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-gray-50 p-8 rounded-xl text-centre">
            {/* Centered Icon Wrapper */}
            <div className="flex justify-center mb-5">
              <MessageSquare className="w-12 h-12 text-green-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Seamless In-App Messaging</h3>
            <p className="text-gray-600">Communicate securely and directly with potential buyers or sellers right from your dashboard.</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AiFeatures;