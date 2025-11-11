"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BookingStatus } from "@/lib/types";
import { BookingCardSkeleton } from "@/components/shared/loading-skeletons";

export default function HomeownerBookingsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          vendor:vendors(id, business_name, category, is_verified)
        `)
        .eq("customer_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const variants: Record<BookingStatus, "default" | "warning" | "success" | "destructive"> = {
      pending: "warning",
      confirmed: "default",
      completed: "success",
      cancelled: "destructive",
    };

    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking request?")) {
      return;
    }

    try {
      const query = supabase.from("bookings");
      const { error } = await query
        // @ts-expect-error - Supabase type inference issue with update
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
        })
        .eq("id", bookingId)
        .eq("customer_id", user!.id)
        .eq("status", "pending"); // Only allow cancelling pending bookings

      if (error) throw error;

      // Refresh bookings
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  if (authLoading) {
    return (
      <div className="space-y-4">
        <BookingCardSkeleton />
        <BookingCardSkeleton />
        <BookingCardSkeleton />
      </div>
    );
  }

  if (!user || profile?.role !== "homeowner") {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-red-600">Only homeowners can view bookings.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
        <p className="text-muted-foreground mt-2">View and manage your service bookings</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <BookingCardSkeleton />
          <BookingCardSkeleton />
          <BookingCardSkeleton />
        </div>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">You haven&apos;t made any booking requests yet.</p>
            <Link href="/vendors">
              <Button>Browse Vendors</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {booking.vendor?.business_name}
                      {booking.vendor?.is_verified && (
                        <Badge variant="success" className="text-xs">
                          ✓
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      <Badge variant="outline" className="mr-2">
                        {booking.vendor?.category}
                      </Badge>
                      {getStatusBadge(booking.status)}
                    </CardDescription>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Requested: {new Date(booking.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">
                      Service Type
                    </h4>
                    <p className="text-muted-foreground">{booking.service_type}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">
                      Preferred Date
                    </h4>
                    <p className="text-muted-foreground">
                      {new Date(booking.preferred_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-1">
                    Description
                  </h4>
                  <p className="text-muted-foreground text-sm">{booking.description}</p>
                </div>

                {booking.price && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Price</h4>
                    <p className="text-2xl font-bold text-foreground">
                      ${booking.price.toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="flex gap-4 pt-2 border-t">
                  <Link href={`/homeowner/bookings/${booking.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>

                  {booking.status === "confirmed" && booking.payment_status === "pending" && booking.price && (
                    <Link href={`/homeowner/bookings/${booking.id}`} className="flex-1">
                      <Button className="w-full">Pay Now</Button>
                    </Link>
                  )}

                  {booking.status === "pending" && (
                    <Button
                      variant="destructive"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel Request
                    </Button>
                  )}

                  {booking.status === "completed" && (
                    <Link href={`/homeowner/bookings/${booking.id}/review`}>
                      <Button variant="outline">Leave Review</Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
