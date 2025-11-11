"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  notes: string | null;
  is_primary: boolean;
}

interface PropertyVendor {
  id: string;
  vendor_id: string;
  is_favorite: boolean;
  is_recurring: boolean;
  recurring_schedule: string | null;
  notes: string | null;
  vendor: {
    id: string;
    business_name: string;
    category: string;
    description: string;
  };
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const [property, setProperty] = useState<Property | null>(null);
  const [propertyVendors, setPropertyVendors] = useState<PropertyVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "favorites" | "recurring">("all");

  useEffect(() => {
    fetchPropertyDetails();
  }, [params.id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Fetch property
      const { data: propertyData, error: propertyError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", user.id)
        .single();

      if (propertyError) throw propertyError;
      setProperty(propertyData);

      // Fetch property vendors with vendor details
      const { data: vendorsData, error: vendorsError } = await supabase
        .from("property_vendors")
        .select(`
          *,
          vendor:vendors(id, business_name, category, description)
        `)
        .eq("property_id", params.id)
        .eq("user_id", user.id);

      if (vendorsError) throw vendorsError;
      setPropertyVendors(vendorsData || []);
    } catch (error) {
      console.error("Error fetching property details:", error);
      router.push("/homeowner/properties");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (propertyVendorId: string, currentValue: boolean) => {
    try {
      const query = supabase.from("property_vendors");
      const { error } = await query
        // @ts-expect-error - Supabase type inference issue with update
        .update({ is_favorite: !currentValue })
        .eq("id", propertyVendorId);

      if (error) throw error;
      fetchPropertyDetails();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const removeVendor = async (propertyVendorId: string) => {
    if (!confirm("Remove this vendor from this property?")) return;

    try {
      const { error } = await supabase
        .from("property_vendors")
        .delete()
        .eq("id", propertyVendorId);

      if (error) throw error;
      fetchPropertyDetails();
    } catch (error) {
      console.error("Error removing vendor:", error);
    }
  };

  const filteredVendors = propertyVendors.filter(pv => {
    if (activeTab === "favorites") return pv.is_favorite;
    if (activeTab === "recurring") return pv.is_recurring;
    return true;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Link href="/homeowner/properties" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Properties
        </Link>
      </div>

      {/* Property Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl flex items-center gap-3">
                {property.name}
                {property.is_primary && (
                  <Badge variant="default">Primary</Badge>
                )}
              </CardTitle>
            </div>
            <Link href={`/homeowner/properties/${property.id}/edit`}>
              <Button variant="outline">Edit Property</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <h3 className="font-semibold mb-2">Address</h3>
            <p>{property.address}</p>
            <p>{property.city}, {property.state} {property.zip_code}</p>
          </div>

          {property.notes && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground">{property.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vendors Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Service Professionals</CardTitle>
              <CardDescription>
                Manage your favorite and recurring service professionals for this property
              </CardDescription>
            </div>
            <Link href={`/vendors`}>
              <Button>Add Vendor</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "all"
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({propertyVendors.length})
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "favorites"
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Favorites ({propertyVendors.filter(pv => pv.is_favorite).length})
            </button>
            <button
              onClick={() => setActiveTab("recurring")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "recurring"
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Recurring ({propertyVendors.filter(pv => pv.is_recurring).length})
            </button>
          </div>

          {/* Vendors List */}
          {filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {activeTab === "all"
                  ? "No vendors added to this property yet"
                  : activeTab === "favorites"
                  ? "No favorite vendors for this property"
                  : "No recurring services scheduled"}
              </p>
              <Link href="/vendors">
                <Button variant="outline">Browse Vendors</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVendors.map((pv) => (
                <div
                  key={pv.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{pv.vendor.business_name}</h4>
                      {pv.is_favorite && (
                        <Badge variant="secondary" className="text-xs">⭐ Favorite</Badge>
                      )}
                      {pv.is_recurring && (
                        <Badge variant="secondary" className="text-xs">🔄 Recurring</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{pv.vendor.category}</p>
                    {pv.notes && (
                      <p className="text-xs text-muted-foreground mt-2">{pv.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleFavorite(pv.id, pv.is_favorite)}
                    >
                      {pv.is_favorite ? "★" : "☆"}
                    </Button>
                    <Link href={`/vendors/${pv.vendor_id}`}>
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeVendor(pv.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
