"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewPropertyPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "Nantucket",
    state: "MA",
    zip_code: "",
    notes: "",
    is_primary: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { error } = await supabase.from("properties").insert({
        user_id: user.id,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        notes: formData.notes || null,
        is_primary: formData.is_primary,
      });

      if (error) throw error;

      router.push("/homeowner/properties");
    } catch (error: any) {
      console.error("Error creating property:", error);
      alert(error.message || "Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <Link href="/homeowner/properties" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Properties
        </Link>
        <h1 className="text-3xl font-bold mt-2">Add New Property</h1>
        <p className="text-muted-foreground mt-1">
          Add a property you own or manage
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
          <CardDescription>
            Enter the details of your property
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Property Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Main Street House, Summer Cottage"
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street"
                required
              />
            </div>

            {/* City, State, Zip */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  maxLength={2}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip_code">Zip Code *</Label>
                <Input
                  id="zip_code"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  placeholder="02554"
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional information about this property..."
                rows={4}
              />
            </div>

            {/* Primary Property */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_primary"
                name="is_primary"
                checked={formData.is_primary}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_primary" className="font-normal">
                Set as primary property
              </Label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Link href="/homeowner/properties" className="flex-1">
                <Button type="button" variant="outline" className="w-full" disabled={loading}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Creating..." : "Create Property"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
