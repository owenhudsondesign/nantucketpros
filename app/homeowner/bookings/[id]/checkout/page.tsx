"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@/hooks/useAuth";
import { CheckoutForm } from "@/components/forms/checkout-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingInfo, setBookingInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && params.id) {
      fetchPaymentIntent();
    }
  }, [user, params.id]);

  const fetchPaymentIntent = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/bookings/payment-intent?booking_id=${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load payment information");
      }

      if (data.status === "succeeded") {
        // Payment already completed
        router.push(`/homeowner/bookings/${params.id}/success`);
        return;
      }

      setClientSecret(data.client_secret);
      setBookingInfo(data.booking);
    } catch (err: any) {
      console.error("Payment intent error:", err);
      setError(err.message || "Failed to load checkout");
    } finally {
      setLoading(false);
    }
  };

  if (!user || profile?.role !== "homeowner") {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-red-600">Only homeowners can access this page.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sand-600">Loading checkout...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !clientSecret || !bookingInfo) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Checkout Error</CardTitle>
            <CardDescription>Unable to process payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-sand-600">{error || "Invalid checkout session"}</p>
            <button
              onClick={() => router.push("/homeowner/bookings")}
              className="text-ocean-600 hover:underline text-sm"
            >
              Back to Bookings
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ocean-900">Complete Your Payment</h1>
        <p className="text-sand-600 mt-2">Secure checkout powered by Stripe</p>
      </div>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-sand-600">Vendor</span>
            <span className="font-semibold">{bookingInfo.vendor_name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-sand-600">Service</span>
            <Badge variant="outline">{bookingInfo.service_type}</Badge>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-sm text-sand-600">Total Amount</span>
            <span className="text-2xl font-bold text-ocean-600">
              ${bookingInfo.price?.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>
            Enter your payment details below. Your payment is secure and processed by Stripe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#0ea5e9",
                },
              },
            }}
          >
            <CheckoutForm
              bookingId={params.id as string}
              amount={bookingInfo.price * 100}
            />
          </Elements>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-sand-500">
        <p>By completing this payment, you agree to our Terms of Service.</p>
        <p className="mt-1">Funds are held securely until service completion.</p>
      </div>
    </div>
  );
}
