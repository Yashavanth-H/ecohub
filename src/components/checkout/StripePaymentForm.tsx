'use client';

import { useEffect, useState } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Loader2 } from 'lucide-react';

interface StripePaymentFormProps {
  clientSecret: string;
  onSuccess: (data: { orderId: string; totalPrice: string }) => void;
  onError: (error: Error) => void;
  getToken: () => Promise<string | null | undefined>;
  shippingAddress: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function InnerCheckoutForm({ clientSecret, onSuccess, onError, getToken, shippingAddress }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    if (!shippingAddress.trim()) {
      return onError(new Error('Shipping address is required before payment.'));
    }
    setIsSubmitting(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: 'http://localhost:3000/checkout',
        },
        redirect: 'if_required',
      });
      if (error) {
        throw new Error(error.message || 'Payment failed.');
      }

      const token = await getToken();
      if (!token) throw new Error('Authentication token is missing. Please sign in again.');

      const resp = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ shippingAddress }),
      });
      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || 'Order creation failed.');
      }
      const data = await resp.json();
      onSuccess({ orderId: data.orderId, totalPrice: data.totalPrice });
    } catch (e: any) {
      onError(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <PaymentElement id="payment-element" />
      <button
        onClick={handleSubmit}
        disabled={!stripe || isSubmitting}
        className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
      >
        {isSubmitting ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>) : 'Pay and Place Order'}
      </button>
    </div>
  );
}

export function StripePaymentForm(props: StripePaymentFormProps) {
  const { clientSecret } = props;
  const [options, setOptions] = useState<any>();

  useEffect(() => {
    if (clientSecret) {
      setOptions({ clientSecret, appearance: { theme: 'stripe' } });
    }
  }, [clientSecret]);

  if (!clientSecret || !options) return null;

  return (
    <Elements stripe={stripePromise} options={options}>
      <InnerCheckoutForm {...props} />
    </Elements>
  );
}


