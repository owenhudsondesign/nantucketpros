"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

export default function VendorDashboardPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [vendor, setVendor] = useState<any>(null);
  const [stats, setStats] = useState({
    pendingBookings: 0,
    completedJobs: 0,
    totalEarnings: 0,
    averageRating: null as number | null,
  });
  const [relevantRequests, setRelevantRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch vendor profile
      const { data: vendorData } = await supabase
        .from("vendors")
        .select("*")
        .eq("user_id", user!.id)
        .single();

      const vendor = vendorData as any;
      setVendor(vendor);

      // Fetch stats
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("*")
        .eq("vendor_id", vendor?.id);

      const bookings = bookingsData as any;
      const pending = bookings?.filter((b: any) => b.status === "pending").length || 0;
      const completed = bookings?.filter((b: any) => b.status === "completed").length || 0;
      const earnings = bookings
        ?.filter((b: any) => b.status === "completed")
        .reduce((sum: number, b: any) => sum + (b.price || 0), 0) || 0;

      // Fetch average rating
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("rating")
        .eq("vendor_id", vendor?.id);

      const reviews = reviewsData as any;
      const avgRating = reviews && reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
        : null;

      setStats({
        pendingBookings: pending,
        completedJobs: completed,
        totalEarnings: earnings,
        averageRating: avgRating,
      });

      // Fetch relevant community requests (matching vendor category)
      if (vendor?.category) {
        const { data: requestsData } = await supabase
          .from("community_requests")
          .select(`
            *,
            homeowner:users!community_requests_homeowner_id_fkey(full_name),
            responses:community_request_responses!community_request_responses_request_id_fkey(
              id,
              vendor_id
            )
          `)
          .eq("status", "open")
          .eq("category", vendor.category)
          .order("created_at", { ascending: false })
          .limit(5);

        // Filter out requests the vendor has already responded to
        const requests = requestsData as any;
        const filtered = requests?.filter((req: any) =>
          !req.responses?.some((res: any) => res.vendor_id === vendor.id)
        ) || [];

        setRelevantRequests(filtered);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your business and bookings</p>
        </div>
        {vendor && !vendor.is_verified && (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending Verification
          </Badge>
        )}
        {vendor && vendor.is_verified && (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            ✓ Verified
          </Badge>
        )}
      </div>

      {vendor && !vendor.is_verified && (
        <Card className="bg-yellow-50 border-2 border-yellow-300">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="text-4xl">⚠️</div>
              <div className="flex-1">
                <CardTitle className="text-yellow-900">Complete Your Business Profile</CardTitle>
                <CardDescription className="text-yellow-700 mt-1">
                  Finish setting up your profile and submit for verification to start receiving bookings from property owners and caretakers
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/vendor/profile">
              <Button size="lg">Complete Profile Setup →</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{stats.pendingBookings}</CardTitle>
            <CardDescription>Pending Bookings</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{stats.completedJobs}</CardTitle>
            <CardDescription>Completed Jobs</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">${stats.totalEarnings.toFixed(2)}</CardTitle>
            <CardDescription>Total Earnings</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {stats.averageRating ? stats.averageRating.toFixed(1) : "-"}
            </CardTitle>
            <CardDescription>Average Rating</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Community Requests Section */}
      {relevantRequests.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>New Service Requests</CardTitle>
                <CardDescription>
                  Requests in your category that you haven&apos;t responded to yet
                </CardDescription>
              </div>
              <Link href="/community">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {relevantRequests.map((request) => (
              <Link key={request.id} href={`/community/${request.id}`}>
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{request.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {request.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{request.category}</Badge>
                        {request.urgency === "urgent" && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                        {request.location && (
                          <span className="text-xs text-muted-foreground">📍 {request.location}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">
                        {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                      </p>
                      {(request.budget_min || request.budget_max) && (
                        <p className="font-semibold text-foreground mt-1">
                          {request.budget_min && request.budget_max
                            ? `$${request.budget_min} - $${request.budget_max}`
                            : request.budget_min
                            ? `$${request.budget_min}+`
                            : `Up to $${request.budget_max}`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link href="/vendor/profile">
            <Button variant="outline">Edit Profile</Button>
          </Link>
          <Link href="/vendor/bookings">
            <Button variant="outline">View Bookings</Button>
          </Link>
          <Link href="/community">
            <Button variant="outline">Browse Requests</Button>
          </Link>
          <Link href="/vendor/messages">
            <Button variant="outline">Check Messages</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
