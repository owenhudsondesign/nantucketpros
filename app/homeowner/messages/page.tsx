"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { MessageThread } from "@/components/shared/message-thread";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomeownerMessagesPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      // Fetch bookings with unread message counts
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          vendor:vendors(id, business_name, category)
        `)
        .eq("customer_id", user!.id)
        .in("status", ["confirmed", "completed"])
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch unread message counts for each booking
      const bookingsData = data as any;
      const bookingsWithUnread = await Promise.all(
        (bookingsData || []).map(async (booking: any) => {
          const { count } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("booking_id", booking.id)
            .eq("read", false)
            .neq("sender_id", user!.id);

          return {
            ...booking,
            unreadCount: count || 0,
          };
        })
      );

      setBookings(bookingsWithUnread);

      // Auto-select first booking if none selected
      if (!selectedBooking && bookingsWithUnread.length > 0) {
        setSelectedBooking(bookingsWithUnread[0]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-sand-600">Loading messages...</p>
        </CardContent>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-sand-600">No active bookings to message about.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Booking List */}
      <div className="md:col-span-1 space-y-3">
        <h2 className="text-xl font-semibold text-ocean-900">Your Bookings</h2>
        {bookings.map((booking) => (
          <Card
            key={booking.id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              selectedBooking?.id === booking.id ? "ring-2 ring-ocean-600" : ""
            }`}
            onClick={() => setSelectedBooking(booking)}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center justify-between">
                {booking.vendor?.business_name}
                {booking.unreadCount > 0 && (
                  <Badge variant="destructive">{booking.unreadCount}</Badge>
                )}
              </CardTitle>
              <CardDescription className="text-sm">
                {booking.service_type}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Message Thread */}
      <div className="md:col-span-2">
        {selectedBooking ? (
          <MessageThread
            bookingId={selectedBooking.id}
            otherPartyName={selectedBooking.vendor?.business_name}
          />
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sand-600">Select a booking to view messages</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
