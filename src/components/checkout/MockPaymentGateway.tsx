'use client';

import { useState, useEffect } from 'react';
import {
    CreditCard,
    Smartphone,
    QrCode,
    Loader2,
    CheckCircle,
    ShieldCheck,
    AlertCircle,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui or similar, fallback if not
// If simple button is needed we can style it manually or import if shadcn is not set up correctly (checking imports later)

interface MockPaymentGatewayProps {
    amount: number;
    onSuccess: (paymentDetails: { method: string; transactionId: string }) => void;
    onCancel: () => void;
}

export const MockPaymentGateway = ({ amount, onSuccess, onCancel }: MockPaymentGatewayProps) => {
    const [method, setMethod] = useState<'upi' | 'card' | 'qr'>('upi');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');

    // UPI State
    const [upiId, setUpiId] = useState('');

    // Card State
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    // Helpers
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

    const generateTransactionId = () =>
        'txn_' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const handlePay = async () => {
        setLoading(true);
        setStep('processing');

        // Simulate network delay
        setTimeout(() => {
            setLoading(false);
            setStep('success');

            // Auto-close after success animation
            setTimeout(() => {
                onSuccess({
                    method: method.toUpperCase(),
                    transactionId: generateTransactionId()
                });
            }, 1500);
        }, 2500); // 2.5s simulated delay
    };

    const isCardValid = cardNumber.length >= 16 && expiry.length === 4 && cvc.length === 3;
    const isUpiValid = upiId.includes('@');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-gray-700">Secure Payment</span>
                    </div>
                    <button onClick={onCancel} className="p-1 hover:bg-gray-200 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        <p className="text-gray-500 text-sm">Total Amount</p>
                        <h2 className="text-3xl font-bold text-gray-900">{formatCurrency(amount)}</h2>
                    </div>

                    {step === 'processing' && (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                            <p className="text-gray-600 font-medium">Processing secure payment...</p>
                            <p className="text-xs text-gray-400">Do not close this window</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <p className="text-green-700 font-bold text-lg">Payment Successful!</p>
                            <p className="text-gray-500 text-sm">Redirecting to order confirmation...</p>
                        </div>
                    )}

                    {step === 'method' && (
                        <>
                            {/* Payment Method Tabs */}
                            <div className="grid grid-cols-3 bg-gray-100 p-1 rounded-lg mb-6">
                                <button
                                    onClick={() => setMethod('upi')}
                                    className={`py-2 rounded-md text-sm font-medium transition ${method === 'upi' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    UPI
                                </button>
                                <button
                                    onClick={() => setMethod('card')}
                                    className={`py-2 rounded-md text-sm font-medium transition ${method === 'card' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Card
                                </button>
                                <button
                                    onClick={() => setMethod('qr')}
                                    className={`py-2 rounded-md text-sm font-medium transition ${method === 'qr' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    QR Code
                                </button>
                            </div>

                            {/* UPI Form */}
                            {method === 'upi' && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 duration-200">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">UPI ID / VPA</label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="username@bank"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">Compatible with GPay, PhonePe, Paytm, BHIM</p>
                                    </div>
                                    <button
                                        onClick={handlePay}
                                        disabled={!isUpiValid}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-200"
                                    >
                                        Verify & Pay {formatCurrency(amount)}
                                    </button>
                                </div>
                            )}

                            {/* Card Form */}
                            {method === 'card' && (
                                <div className="space-y-4 animate-in slide-in-from-right-4 duration-200">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Card Number</label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="0000 0000 0000 0000"
                                                maxLength={19}
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Expiry</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                maxLength={4}
                                                value={expiry}
                                                onChange={(e) => setExpiry(e.target.value)}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">CVC</label>
                                            <input
                                                type="password"
                                                placeholder="123"
                                                maxLength={3}
                                                value={cvc}
                                                onChange={(e) => setCvc(e.target.value)}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handlePay}
                                        disabled={!isCardValid}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-200"
                                    >
                                        Pay {formatCurrency(amount)}
                                    </button>
                                </div>
                            )}

                            {/* QR Code Form */}
                            {method === 'qr' && (
                                <div className="text-center space-y-4 animate-in slide-in-from-right-4 duration-200">
                                    <div className="bg-white border-2 border-dashed border-gray-300 p-4 rounded-xl inline-block">
                                        {/* Fake QR Code Pattern */}
                                        <div className="w-48 h-48 bg-gray-900 grid grid-cols-4 gap-1 p-1">
                                            {Array.from({ length: 16 }).map((_, i) => (
                                                <div key={i} className={`bg-white ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-20'}`}></div>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">Scan this QR code with any UPI app</p>
                                    <button
                                        onClick={handlePay}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-200"
                                    >
                                        Payment Done
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Footer for trust */}
                    <div className="mt-6 pt-4 border-t flex justify-center gap-4 opacity-50 grayscale">
                        {/* Fake logos */}
                        <div className="h-6 w-10 bg-gray-300 rounded"></div>
                        <div className="h-6 w-10 bg-gray-300 rounded"></div>
                        <div className="h-6 w-10 bg-gray-300 rounded"></div>
                        <div className="h-6 w-10 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
