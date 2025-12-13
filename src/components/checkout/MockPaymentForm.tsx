'use client';

import { useState } from 'react';
import { Loader2, DollarSign, CreditCard, ShieldCheck } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

// Define the props our component will accept
interface MockPaymentFormProps {
  totalAmount: number;
  fulfillmentUrl: string;
  fulfillmentMetadata: { shippingAddress: string };
  getToken: () => Promise<string | null>;
  onSuccess: (data: { orderId: string, totalPrice: string }) => void;
  onError: (error: Error) => void;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement> & { style?: React.CSSProperties };
}

// --- NEW: Simple UPI Icon ---
const UpiIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.42004 15.63L7.42004 10.63C7.42004 7.21 9.17004 6.42 11.59 6.42C14.01 6.42 15.76 7.21 15.76 10.63V10.88" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.59 2.5C16.54 2.5 20.59 6.55 20.59 11.5C20.59 16.45 16.54 20.5 11.59 20.5C6.64004 20.5 2.59004 16.45 2.59004 11.5C2.59004 6.55 6.64004 2.5 11.59 2.5Z" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.75 10.88H13.12C12.2 10.88 11.59 11.49 11.59 12.41V12.41C11.59 13.33 12.2 13.94 13.12 13.94H15.75V10.88Z" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.82996 15.63V12.41C9.82996 11.49 9.21996 10.88 8.29996 10.88H7.41996" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
// --- END UPI Icon ---

export const MockPaymentForm = ({ 
    totalAmount,
    fulfillmentUrl, 
    fulfillmentMetadata, 
    getToken,
    onSuccess, 
    onError, 
    buttonProps = {}
}: MockPaymentFormProps) => {
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
    
    // --- NEW: State for fake form fields ---
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [upiId, setUpiId] = useState('');
    // --- END NEW STATE ---

    // Check if the form is valid enough to enable the pay button
    const isFormValid = () => {
      if (!fulfillmentMetadata.shippingAddress || !fulfillmentMetadata.shippingAddress.trim()) {
        return false;
      }
      if (paymentMethod === 'card') {
        return cardNumber.length >= 15 && expiry.length >= 4 && cvc.length >= 3;
      }
      if (paymentMethod === 'upi') {
        return upiId.includes('@');
      }
      return false;
    };
    
    const handleMockPayment = async () => {
        if (!isFormValid()) {
             return onError(new Error("Please fill in all required payment and shipping details."));
        }

        setIsProcessing(true);
        
        try {
            const token = await getToken();
            if (!token) throw new Error("Authentication failed. Please log in again.");

            // 1. Simulate payment processing (1.5 seconds)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 2. Call the fulfillment endpoint (your POST /api/orders)
            const response = await fetch(fulfillmentUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(fulfillmentMetadata),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Fulfillment failed.');
            }
            
            const data = await response.json();
            onSuccess(data);

        } catch (error: any) {
            onError(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full">
            {/* --- NEW: Payment Method Tabs --- */}
            <div className="flex mb-4 border-b">
                <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 flex items-center justify-center py-3 font-medium ${
                        paymentMethod === 'card' 
                        ? 'border-b-2 border-green-600 text-green-600' 
                        : 'text-gray-500'
                    }`}
                >
                    <CreditCard className="w-5 h-5 mr-2" /> Credit/Debit Card
                </button>
                <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 flex items-center justify-center py-3 font-medium ${
                        paymentMethod === 'upi' 
                        ? 'border-b-2 border-green-600 text-green-600' 
                        : 'text-gray-500'
                    }`}
                >
                    <UpiIcon /> <span className="ml-2">UPI</span>
                </button>
            </div>

            {/* --- NEW: Payment Forms --- */}
            <div className="space-y-4">
                {/* Card Form */}
                {paymentMethod === 'card' && (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Card Number</label>
                            <input 
                                type="text" 
                                placeholder="0000 0000 0000 0000"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Expiry (MM/YY)</label>
                                <input 
                                    type="text" 
                                    placeholder="MM/YY"
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">CVC</label>
                                <input 
                                    type="text" 
                                    placeholder="123"
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                        </div>
                    </div>
                )}
                
                {/* UPI Form */}
                {paymentMethod === 'upi' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">UPI ID</label>
                        <input 
                            type="text" 
                            placeholder="yourname@bank"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                )}
            </div>

            {/* --- NEW: Upgraded Pay Button --- */}
            <button
                type="button"
                onClick={handleMockPayment}
                disabled={isProcessing || !isFormValid()}
                className="w-full flex items-center justify-center font-bold py-3 rounded-lg transition mt-6"
                style={{
                    backgroundColor: isFormValid() ? (buttonProps.style?.backgroundColor || '#10B981') : '#9CA3AF',
                    color: 'white',
                    cursor: isFormValid() ? 'pointer' : 'not-allowed',
                }}
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing Payment...
                    </>
                ) : (
                    <>
                        <ShieldCheck className="w-5 h-5 mr-2" /> 
                        Pay ₹{totalAmount.toFixed(2)} Securely
                    </>
                )}
            </button>
        </div>
    );
};

