"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  const params = useParams();
  const supabase = createClient();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchBooking();
    }
  }, [params.id]);

  const fetchBooking = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          vendor:vendors(id, business_name, category)
        `)
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setBooking(data);
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-16">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sand-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-16 space-y-8">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Your booking has been confirmed and payment received
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {booking && (
            <div className="space-y-3 p-4 bg-sand-50 rounded-md">
              <div className="flex justify-between">
                <span className="text-sm text-sand-600">Vendor</span>
                <span className="font-semibold">{booking.vendor?.business_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-sand-600">Service</span>
                <span className="font-semibold">{booking.service_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-sand-600">Amount Paid</span>
                <span className="font-semibold text-ocean-600">
                  ${booking.price?.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <h4 className="font-semibold text-sm text-ocean-900 mb-3">What happens next?</h4>
            <ul className="space-y-2 text-sm text-sand-600">
              <li className="flex items-start gap-2">
                <span className="text-ocean-600 mt-0.5">✓</span>
                <span>The vendor has been notified and will contact you to schedule the service</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ocean-600 mt-0.5">✓</span>
                <span>Your payment is held securely until the service is completed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ocean-600 mt-0.5">✓</span>
                <span>You can message the vendor directly through your booking dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ocean-600 mt-0.5">✓</span>
                <span>After service completion, you&apos;ll be able to leave a review</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <Link href="/homeowner/bookings" className="flex-1">
              <Button className="w-full">View My Bookings</Button>
            </Link>
            <Link href="/vendors">
              <Button variant="outline">Browse More Vendors</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
