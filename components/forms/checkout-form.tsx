"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";

interface CheckoutFormProps {
  bookingId: string;
  amount: number;
  onSuccess?: () => void;
}

export function CheckoutForm({ bookingId, amount, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/homeowner/bookings/${bookingId}/success`,
        },
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      // Payment will be confirmed via redirect
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="pt-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-sand-600">Total Amount</span>
          <span className="text-2xl font-bold text-ocean-900">
            ${(amount / 100).toFixed(2)}
          </span>
        </div>

        <Button type="submit" disabled={!stripe || loading} className="w-full" size="lg">
          {loading ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
        </Button>
      </div>

      <p className="text-xs text-center text-sand-500">
        Your payment is processed securely by Stripe. Funds are held until service completion.
      </p>
    </form>
  );
}
