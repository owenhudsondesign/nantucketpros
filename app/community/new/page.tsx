"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VENDOR_CATEGORIES } from "@/lib/types";

const NANTUCKET_AREAS = [
  "Town",
  "Madaket",
  "Siasconset",
  "Surfside",
  "Mid Island",
  "All of Nantucket",
];

export default function NewCommunityRequestPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [urgency, setUrgency] = useState("normal");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!user) {
        throw new Error("You must be logged in");
      }

      if (profile?.role !== "homeowner") {
        throw new Error("Only homeowners can post service requests");
      }

      // Validate required fields
      if (!title.trim() || !description.trim() || !category) {
        throw new Error("Please fill in all required fields");
      }

      // Insert community request
      const { data, error } = await supabase
        .from("community_requests")
        .insert({
          homeowner_id: user.id,
          title: title.trim(),
          description: description.trim(),
          category,
          location: location || null,
          budget_min: budgetMin ? parseInt(budgetMin) : null,
          budget_max: budgetMax ? parseInt(budgetMax) : null,
          preferred_date: preferredDate || null,
          urgency,
          status: "open",
        })
        .select()
        .single();

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Service request posted successfully!",
      });

      // Redirect to the request detail page after a short delay
      setTimeout(() => {
        router.push(`/community/${data.id}`);
      }, 1500);
    } catch (error: any) {
      console.error("Error creating community request:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to post service request. Please try again.",
      });
      setLoading(false);
    }
  };

  if (!user || profile?.role !== "homeowner") {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Only homeowners can post service requests.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Post Service Request</h1>
        <p className="text-muted-foreground mt-2">
          Let vendors know what you need and receive responses directly
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>
            Provide details about the service you need. The more specific, the better responses you&apos;ll get.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Request Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Need plumber for kitchen sink repair"
                required
                disabled={loading}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                {title.length}/200 characters
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Service Category <span className="text-red-500">*</span>
              </Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select a category</option>
                {VENDOR_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you need in detail. Include any specific requirements, timeframes, or important information..."
                required
                disabled={loading}
                rows={6}
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/2000 characters
              </p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select an area (optional)</option>
                {NANTUCKET_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Range */}
            <div className="space-y-2">
              <Label>Budget Range (Optional)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetMin" className="text-sm text-muted-foreground">
                    Minimum ($)
                  </Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    placeholder="Min"
                    min="0"
                    step="50"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetMax" className="text-sm text-muted-foreground">
                    Maximum ($)
                  </Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    placeholder="Max"
                    min="0"
                    step="50"
                    disabled={loading}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Leave blank if you&apos;re not sure. Vendors will provide quotes.
              </p>
            </div>

            {/* Preferred Date */}
            <div className="space-y-2">
              <Label htmlFor="preferredDate">Preferred Date (Optional)</Label>
              <Input
                id="preferredDate"
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                When would you like the service to be completed?
              </p>
            </div>

            {/* Urgency */}
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency</Label>
              <select
                id="urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Mark as urgent if you need the service completed soon
              </p>
            </div>

            {message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Posting..." : "Post Request"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
