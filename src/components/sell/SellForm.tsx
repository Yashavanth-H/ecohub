'use client';

// 1. We import all the hooks we need
import React, { useState } from "react";
import { useRouter } from 'next/navigation'; // 1. IMPORT useRouter
import { useAuth } from '@clerk/nextjs';
import { Sparkles } from 'lucide-react'; // Added Sparkles icon for AI button

// Helper component for clean section headers
const FormSectionHeader = ({ title, description }: { title: string, description?: string }) => (
  <div className="border-b border-gray-200 pb-3 mb-6">
    <h3 className="text-lg font-semibold leading-6 text-gray-900">{title}</h3>
    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
  </div>
);

export function SellForm() {
  // 2. We keep the clean 'formData' state from your expert form
  const [formData, setFormData] = useState<Record<string, any>>({
    condition: 'New',
    usage_freq: 'Occasional',
    env: 'Indoor - Controlled',
    maintenance: 'No',
    consent: 'yes'
  });
  
  const { getToken } = useAuth();
  const router = useRouter(); // 2. Initialize router
  
  // 3. We add back our AI/Image-specific state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  
  // --- THIS IS THE FIX ---
  // Add the missing state variable for the "Generate with AI" button
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  // --- END OF FIX ---


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      // 4. If the input is a file, we trigger our AI upload function
      handleImageUpload(e as React.ChangeEvent<HTMLInputElement>);
    } else {
      // Otherwise, just update the formData state
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 5. This is our re-integrated AI Image Upload Function (Hugging Face)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setIsUploading(true);
    setAnalysisResult('Uploading & analyzing image...');
    try {
      const token = await getToken();
      if (!token) throw new Error('You must be logged in.');
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('http://localhost:5001/api/ai/image-analysis', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Image analysis failed');
      }
      
      const data = await response.json();
      setImageUrl(data.imageUrl);
      setCategoryId(data.categoryId); // AI sets this
      setAnalysisResult(`✅ Category Detected: ${data.categoryName}`);
      
      // Also update our main form data with the results
      setFormData((prev) => ({ 
        ...prev, 
        image_url: data.imageUrl, 
        category_id: data.categoryId,
        category_name: data.categoryName // Store for the description prompt
      }));

    } catch (err: any) {
      console.error(err);
      setAnalysisResult(`Error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  // 6. NEW AI Description Generator
  const handleGenerateDescription = async () => {
    if (!formData.title || !categoryId) {
      alert("Please upload an image (to get the category) and enter a Title before generating a description.");
      return;
    }
    
    setIsGeneratingDesc(true);
    setAnalysisResult("🤖 Generating AI description...");
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch('http://localhost:5001/api/ai/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          categoryName: formData.category_name, // From AI image upload
          materials: formData.material,
          condition: formData.condition,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to generate description.");
      }

      const data = await response.json();
      
      // Update the form state with the new description
      setFormData(prev => ({ ...prev, description: data.description }));
      setAnalysisResult("✅ Description generated!");
      
    } catch (err: any) {
      console.error("Description generation failed:", err);
      alert(`Error: ${err.message}`);
      setAnalysisResult(`Error: ${err.message}`);
    } finally {
      setIsGeneratingDesc(false);
    }
  };


  // 7. *** THIS IS THE FIX ***
  // The 'handleSubmit' function now reads from 'formData.title', etc.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl || !categoryId) {
      alert('Please upload an image and wait for it to be analyzed.');
      return;
    }
    if (isUploading) {
      alert('Please wait for the image analysis to finish.');
      return;
    }

    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      // Consolidate all data from the 'formData' state
      const productData = {
        // Core data
        title: formData.title, // <-- FIXED
        price: parseFloat(formData.price), // <-- FIXED
        description: formData.description, // <-- FIXED
        condition: formData.condition || 'New',
        original_purchase_date: formData.mfg_date, // <-- FIXED
        category_id: categoryId, // From AI state
        image_url: imageUrl,     // From AI state
        
        // Expert data
        materials: formData.material,
        brand: formData.brand,
        model: formData.sku,
        ip_rating: formData.ip_rating,
        warranty_period_months: parseInt(formData.warranty) || null,
        certifications: formData.certs,
        usage_frequency: formData.usage_freq,
        operating_environment: formData.env,
        maintenance_required: formData.maintenance === 'Yes',
        consumable_parts: formData.consumables,
        battery_info: formData.battery,
        component_ratings: formData.mtbf,
        software_support_period_years: parseInt(formData.software_support) || null,
        known_failure_modes: formData.failures,
        approx_usage_hours: parseInt(formData.usage_hours) || null,
        service_repair_history: formData.repair_history,
      };

      const response = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        // This is where your error was being thrown
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to list product');
      }

      const result = await response.json();
      alert(result.message); 
      router.push('/dashboard'); 

    } catch (err: any) {
      console.error('Error listing product:', err);
      alert(`Error: ${err.message}`);
    }
  };


  return (
     <div className="w-full max-w-4xl p-8 bg-white shadow-2xl rounded-2xl border border-gray-100 my-12">
       <h1 className="text-2xl font-semibold text-center mb-2">Sell your product</h1>
       <p className="text-gray-500 text-center mb-8">
         Fill the fields below to help estimate the product's usable life. Fields marked * are
         required.
       </p>

       <form className="space-y-8" onSubmit={handleSubmit}>
         {/* Section 1: Product Basics */}
         <section className="border border-gray-200 rounded-xl p-6">
           <FormSectionHeader title="1) Product Basics" />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium mb-1">Product Title *</label>
               <input
                name="title"
                required
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="e.g. Acme 12"
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium mb-1">Brand</label>
               <input
                name="brand"
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="e.g. IKEA, Local Carpenter"
               />
             </div>
             <div>
               <label className="block text-sm font-medium mb-1">Model / SKU</label>
               <input
                name="sku"
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="Model number or SKU"
               />
             </div>
             <div className="md:col-span-2">
               {/* --- AI Generate Button --- */}
               <div className="flex justify-between items-center mb-1">
                 <label className="block text-sm font-medium">Short Description</label>
                 <button 
                   type="button" 
                   onClick={handleGenerateDescription}
                   disabled={isGeneratingDesc || isUploading || !formData.title || !categoryId}
                   className="text-xs bg-green-100 text-green-700 font-semibold py-1 px-2 rounded-md hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                 >
                   <Sparkles className="w-3 h-3 mr-1" />
                   {isGeneratingDesc ? "Generating..." : "Generate with AI"}
                 </button>
               </div>
               <textarea
                name="description"
                value={formData.description || ''} // Controlled component
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="Key materials, finishes, known constraints... or let AI generate it!"
               />
               <p className="text-xs text-gray-500 mt-1">
                Helps map to similar product lifespans on the platform.
               </p>
             </div>
           </div>
         </section>

         {/* Section 2: Materials & Build */}
         <section className="border border-gray-200 rounded-xl p-6">
           <FormSectionHeader title="2) Materials & Build" />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium mb-1">Primary Material *</label>
               <select
                name="material"
                required
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
               >
                <option value="">Select material</option>
                <option>Plastic / Polymer</option>
                <option>Iron</option>
                <option>Fiber</option>
                <option>Aluminum</option>
                <option>Stainless Steel</option>
                <option>Glass</option>
                <option>Wood</option>
                <option>Leather</option>
                <option>Fabric / Textile</option>
                <option>Composite</option>
               </select>
             </div>
              <div>
                <label className="block text-sm font-medium mb-1">IP / Protection Rating (if any)</label>
                <input
                  name="ip_rating"
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  placeholder="e.g. IP67"
                />
              </div>
             <div>
               <label className="block text-sm font-medium mb-1">Manufacturing Date *</label>
               <input
                type="date"
                name="mfg_date"
                required
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
               />
             </div>
             <div>
               <label className="block text-sm font-medium mb-1">Warranty Period (months)</label>
               <input
                type="number"
                name="warranty"
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="e.g. 24"
               />
             </div>
              <div className="md:col-span-2">
               <label className="block text-sm font-medium mb-1">Certifications</label>
               <input
                name="certs"
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="e.g. CE, ISO, RoHS"
               />
             </div>
           </div>
         </section>

         {/* Section 3: Usage & Environment */}
         <section className="border border-gray-200 rounded-xl p-6">
           <FormSectionHeader title="3) Usage & Environment" />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium mb-1">Usage Frequency *</label>
               <select name="usage_freq" required onChange={handleChange} className="w-full border rounded-lg p-2" defaultValue="Occasional">
                <option>Occasional</option>
                <option>Weekly</option>
                <option>Daily</option>
                <option>Heavy Duty</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium mb-1">Operating Conditions *</label>
               <select name="env" onChange={handleChange} className="w-full border rounded-lg p-2" defaultValue="Indoor - Controlled">
                <option>Indoor - Controlled</option>
                <option>Indoor - Uncontrolled (e.g. warehouse)</option>
                <option>Outdoor - Sheltered</option>
                <option>Outdoor - Exposed</option>
               </select>
             </div>
              <div>
                <label className="block text-sm font-medium mb-1">Maintenance Required? *</label>
                <select name="maintenance" onChange={handleChange} className="w-full border rounded-lg p-2" defaultValue="No">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Consumable/Replaceable Parts</label>
                <input
                  name="consumables"
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  placeholder="e.g. filter, battery, blade"
                />
              </div>
           </div>
         </section>

         {/* Section 4: Performance & Components */}
         <section className="border border-gray-200 rounded-xl p-6">
           <FormSectionHeader title="4) Performance & Components" />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium mb-1">Battery / Cycle Info</label>
               <input
                name="battery"
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="e.g. 500 charge cycles"
               />
             </div>
             <div>
               <label className="block text-sm font-medium mb-1">Key Component Ratings (MTBF)</label>
               <input
                name="mtbf"
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="e.g. 10,000 hrs"
               />
             </div>
              <div>
                <label className="block text-sm font-medium mb-1">Software Support Period (years)</label>
                <input
                  type="number"
                  name="software_support"
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  placeholder="e.g. 3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Known Failure Modes</label>
                <input
                  name="failures"
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  placeholder="e.g. battery swelling, connector failure"
                />
              </div>
           </div>
         </section>

         {/* Section 5: Condition & History */}
         <section className="border border-gray-200 rounded-xl p-6">
           <FormSectionHeader title="5) Condition & History" />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium mb-1">Condition *</label>
               <select name="condition" required onChange={handleChange} className="w-full border rounded-lg p-2" defaultValue="New">
                <option>New</option>
                <option>Like New</option>
                <option>Used</option>
                <option>Refurbished</option>
                <option>For Parts</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium mb-1">Approx. Usage (hours)</label>
               <input
                type="number"
                name="usage_hours"
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
               />
             </div>
             <div className="md:col-span-2">
               <label className="block text-sm font-medium mb-1">Repair History</label>
               <textarea
                name="repair_history"
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="List repairs or replaced parts"
               />
             </div>
           </div>
         </section>
         
         {/* --- 6. Marketplace Info (Image & Price) --- */}
         <fieldset className="mb-6 border border-gray-200 rounded-xl p-6">
           <FormSectionHeader title="6) Marketplace Info" />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="md:col-span-2">
               {/* This is our AI Categorization section */}
               <label className="block text-sm font-bold text-gray-700" htmlFor="image">Upload Product Image *</label>
               <p className="text-xs text-gray-500 mb-2">Our AI will detect the category from your image (e.g., "Bicycle", "Laptop").</p>
               <input 
                 id="image" 
                 name="image" // Added name for handleChange
                 type="file" 
                 accept="image/png, image/jpeg, image/jpg" 
                 onChange={handleChange} // Use the unified handler
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" 
                 required 
               />
               {analysisResult && (<p className="text-sm font-semibold text-green-700 mt-2">{analysisResult}</p>)}
               {imageUrl && (<div className="mt-4"><img src={imageUrl} alt="Uploaded preview" className="w-48 h-auto object-cover rounded-md border" /></div>)}
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-700" htmlFor="price">Price (INR) *</label>
               <input 
                 id="price" 
                 name="price" // Added name for handleChange
                 type="number" 
                 step="0.01" 
                 onChange={handleChange} 
                 className="shadow-sm mt-1 border border-gray-300 rounded-md w-full py-2 px-3" 
                 required 
               />
             </div>
           </div>
         </fieldset>

         {/* --- 7. Seller Contact & Consent --- */}
         <section className="border border-gray-200 rounded-xl p-6">
           <FormSectionHeader title="7) Seller Contact & Consent" />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium mb-1">Contact Email *</label>
               <input
                name="email"
                type="email"
                required
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                placeholder="seller@example.com"
               />
             </div>
             <div>
               <label className="block text-sm font-medium mb-1">Consent to Use Data (for AI estimates)</label>
               <select name="consent" onChange={handleChange} className="w-full border rounded-lg p-2" defaultValue="yes">
                <option value="yes">Yes - OK to use</option>
                <option value="no">No</option>
               </select>
             </div>
           </div>
         </section>

         {/* --- Submit Button --- */}
         <div className="flex items-center justify-end mt-8 border-t pt-6">
           <button
            type="reset"
            className="text-gray-600 font-medium py-2 px-4 mr-3 hover:bg-gray-100 rounded-md"
            onClick={() => {
              setFormData({});
              setImageFile(null);
              setImageUrl(null);
              setAnalysisResult(null);
              setCategoryId(null);
            }}
           >
            Reset
           </button>
           <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition transform hover:scale-105"
            disabled={isUploading || !categoryId || isGeneratingDesc}
           >
            {isUploading ? 'Analyzing...' : (isGeneratingDesc ? 'Generating...' : 'Save & Estimate')}
           </button>
         </div>
       </form>
     </div>
  );
}

