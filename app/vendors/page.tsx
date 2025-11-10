"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { VendorCard } from "@/components/vendor/vendor-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { VENDOR_CATEGORIES } from "@/lib/types";
import { VendorCardSkeleton } from "@/components/shared/loading-skeletons";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

const NANTUCKET_AREAS = [
  "Town",
  "Madaket",
  "Siasconset",
  "Surfside",
  "Mid Island",
  "All of Nantucket",
];

export default function VendorsDirectoryPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [vendors, setVendors] = useState<any[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Get user role from JWT claims to avoid RLS recursion issue
        const { data: { session } } = await supabase.auth.getSession();
        const role = session?.user?.user_metadata?.role;
        setUserRole(role || null);
      }

      setAuthLoading(false);
    };

    checkAuth();
    fetchVendors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vendors, searchQuery, selectedCategory, selectedArea, verifiedOnly, sortBy]);

  const fetchVendors = async () => {
    try {
      setLoading(true);

      // Fetch all verified vendors (public can only see verified vendors via RLS)
      const { data: vendorsData, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("is_verified", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch reviews and calculate ratings for each vendor
      const vendorsWithRatings = await Promise.all(
        (vendorsData || []).map(async (vendor) => {
          const { data: reviews } = await supabase
            .from("reviews")
            .select("rating")
            .eq("vendor_id", vendor.id);

          const ratings = reviews?.map((r) => r.rating) || [];
          const averageRating =
            ratings.length > 0
              ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
              : 0;

          return {
            ...vendor,
            averageRating,
            reviewCount: ratings.length,
          };
        })
      );

      setVendors(vendorsWithRatings);
      setFilteredVendors(vendorsWithRatings);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...vendors];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (vendor) =>
          vendor.business_name.toLowerCase().includes(query) ||
          vendor.description?.toLowerCase().includes(query) ||
          vendor.services.some((service: string) => service.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((vendor) => vendor.category === selectedCategory);
    }

    // Service area filter
    if (selectedArea) {
      filtered = filtered.filter(
        (vendor) =>
          vendor.service_area.includes(selectedArea) ||
          vendor.service_area.includes("All of Nantucket")
      );
    }

    // Verified only filter
    if (verifiedOnly) {
      filtered = filtered.filter((vendor) => vendor.is_verified);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "rating":
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "reviews":
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "name":
        filtered.sort((a, b) => a.business_name.localeCompare(b.business_name));
        break;
    }

    setFilteredVendors(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedArea("");
    setVerifiedOnly(false);
    setSortBy("newest");
  };

  // Render appropriate header based on user role
  const renderHeader = () => {
    if (authLoading) {
      // Show a loading header while checking auth
      return (
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="w-48 h-12 bg-gray-200 animate-pulse rounded"></div>
              <div className="flex space-x-4">
                <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
                <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </header>
      );
    }

    if (!user || !userRole) {
      return <Header />;
    }

    // Logged-in users get a simplified header with back to dashboard link
    return (
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/${userRole}/dashboard`} className="flex items-center">
              <Image
                src="/nantucketpros-logo.svg"
                alt="NantucketPros"
                width={180}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href={`/${userRole}/dashboard`} className="text-sand-700 hover:text-foreground transition-colors">
                Dashboard
              </Link>
              {userRole === "homeowner" && (
                <>
                  <Link href="/homeowner/properties" className="text-sand-700 hover:text-foreground transition-colors">
                    Properties
                  </Link>
                  <Link href="/vendors" className="text-sand-700 hover:text-foreground transition-colors">
                    Find Vendors
                  </Link>
                  <Link href="/homeowner/bookings" className="text-sand-700 hover:text-foreground transition-colors">
                    My Bookings
                  </Link>
                  <Link href="/homeowner/messages" className="text-sand-700 hover:text-foreground transition-colors">
                    Messages
                  </Link>
                </>
              )}
              {userRole === "vendor" && (
                <>
                  <Link href="/vendor/bookings" className="text-sand-700 hover:text-foreground transition-colors">
                    Bookings
                  </Link>
                  <Link href="/vendor/messages" className="text-sand-700 hover:text-foreground transition-colors">
                    Messages
                  </Link>
                  <Link href="/vendor/profile" className="text-sand-700 hover:text-foreground transition-colors">
                    My Profile
                  </Link>
                </>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              <Link href={`/${userRole}/profile`}>
                <Button variant="outline" size="sm">Profile</Button>
              </Link>
              <form action="/auth/signout" method="post">
                <Button variant="ghost" size="sm" type="submit">Log Out</Button>
              </form>
            </div>
          </div>
        </div>
      </header>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {renderHeader()}

      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Find Local Businesses</h1>
            <p className="text-muted-foreground mt-2">
              Browse verified service professionals on Nantucket
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-6 mb-8 space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2 space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by business name or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">All Categories</option>
                  {VENDOR_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Area */}
              <div className="space-y-2">
                <Label htmlFor="area">Service Area</Label>
                <select
                  id="area"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">All Areas</option>
                  {NANTUCKET_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <Label htmlFor="sort">Sort By</Label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedCategory || selectedArea || verifiedOnly) && (
              <div className="flex items-center gap-2 pt-2 border-t">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary">Search: {searchQuery}</Badge>
                )}
                {selectedCategory && (
                  <Badge variant="secondary">{selectedCategory}</Badge>
                )}
                {selectedArea && <Badge variant="secondary">{selectedArea}</Badge>}
                {verifiedOnly && <Badge variant="secondary">Verified Only</Badge>}
                <button
                  onClick={clearFilters}
                  className="text-xs text-foreground hover:underline ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <VendorCardSkeleton />
              <VendorCardSkeleton />
              <VendorCardSkeleton />
              <VendorCardSkeleton />
              <VendorCardSkeleton />
              <VendorCardSkeleton />
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No businesses found matching your criteria
              </p>
              {(searchQuery || selectedCategory || selectedArea) && (
                <button
                  onClick={clearFilters}
                  className="text-foreground hover:underline text-sm"
                >
                  Clear filters and show all businesses
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {filteredVendors.length} business{filteredVendors.length !== 1 ? "es" : ""}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    averageRating={vendor.averageRating}
                    reviewCount={vendor.reviewCount}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
