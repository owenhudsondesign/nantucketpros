"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface DashboardStats {
  totalVendors: number;
  pendingVendors: number;
  verifiedVendors: number;
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalRevenue: number;
  platformRevenue: number;
  totalUsers: number;
  totalReviews: number;
  averageRating: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [stats, setStats] = useState<DashboardStats>({
    totalVendors: 0,
    pendingVendors: 0,
    verifiedVendors: 0,
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    platformRevenue: 0,
    totalUsers: 0,
    totalReviews: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch vendor stats
      const { count: totalVendors } = await supabase
        .from("vendors")
        .select("*", { count: "exact", head: true });

      const { count: pendingVendors } = await supabase
        .from("vendors")
        .select("*", { count: "exact", head: true })
        .eq("is_verified", false);

      const { count: verifiedVendors } = await supabase
        .from("vendors")
        .select("*", { count: "exact", head: true })
        .eq("is_verified", true);

      // Fetch booking stats
      const { count: totalBookings } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true });

      const { count: activeBookings } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("status", "confirmed");

      const { data: completedBookingsData } = await supabase
        .from("bookings")
        .select("price")
        .eq("status", "completed");

      const completedBookings = completedBookingsData?.length || 0;
      const totalRevenue = completedBookingsData?.reduce(
        (sum, booking: any) => sum + (booking.price || 0),
        0
      ) || 0;
      const platformRevenue = totalRevenue * 0.10; // 10% commission

      // Fetch user stats
      const { count: totalUsers } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      // Fetch review stats
      const { count: totalReviews } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true });

      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("rating");

      const averageRating = reviewsData && reviewsData.length > 0
        ? reviewsData.reduce((sum, r: any) => sum + r.rating, 0) / reviewsData.length
        : 0;

      setStats({
        totalVendors: totalVendors || 0,
        pendingVendors: pendingVendors || 0,
        verifiedVendors: verifiedVendors || 0,
        totalBookings: totalBookings || 0,
        activeBookings: activeBookings || 0,
        completedBookings,
        totalRevenue,
        platformRevenue,
        totalUsers: totalUsers || 0,
        totalReviews: totalReviews || 0,
        averageRating,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-sand-600">Loading dashboard...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Platform overview and management
        </p>
      </div>

      {/* Revenue Section */}
      <div>
        <h2 className="text-xl font-semibold text-ocean-900 mb-4">Revenue</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Transaction Volume</CardDescription>
              <CardTitle className="text-3xl">
                {formatCurrency(stats.totalRevenue)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Platform Revenue (10%)</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {formatCurrency(stats.platformRevenue)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed Bookings</CardDescription>
              <CardTitle className="text-3xl">
                {stats.completedBookings}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Vendor Management */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-ocean-900">Vendor Management</h2>
          <Link href="/admin/vendors">
            <Button variant="outline">Manage Vendors</Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Vendors</CardDescription>
              <CardTitle className="text-3xl">{stats.totalVendors}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Verification</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">
                {stats.pendingVendors}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.pendingVendors > 0 && (
                <Link href="/admin/vendors">
                  <Button variant="outline" size="sm" className="w-full">
                    Review Applications
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Verified Vendors</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {stats.verifiedVendors}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Booking Oversight */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-ocean-900">Booking Oversight</h2>
          <Link href="/admin/bookings">
            <Button variant="outline">View All Bookings</Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Bookings</CardDescription>
              <CardTitle className="text-3xl">{stats.totalBookings}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Bookings</CardDescription>
              <CardTitle className="text-3xl text-blue-600">
                {stats.activeBookings}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {stats.completedBookings}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Platform Health */}
      <div>
        <h2 className="text-xl font-semibold text-ocean-900 mb-4">Platform Health</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl">{stats.totalUsers}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Reviews</CardDescription>
              <CardTitle className="text-3xl">{stats.totalReviews}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Average Rating</CardDescription>
              <CardTitle className="text-3xl">
                {stats.averageRating > 0 ? `${stats.averageRating.toFixed(1)} ★` : "N/A"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-ocean-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vendor Verification</CardTitle>
              <CardDescription>
                Review and approve pending vendor applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/vendors">
                <Button className="w-full">
                  {stats.pendingVendors > 0
                    ? `Review ${stats.pendingVendors} Application${stats.pendingVendors !== 1 ? "s" : ""}`
                    : "View All Vendors"}
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Management</CardTitle>
              <CardDescription>
                Monitor active bookings and handle disputes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/bookings">
                <Button className="w-full">
                  View Bookings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
