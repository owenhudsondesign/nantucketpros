"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VENDOR_CATEGORIES } from "@/lib/types";
import type { VendorCategory } from "@/lib/types";
import { FileUpload } from "@/components/forms/file-upload";
import {
  uploadFile,
  deleteFile,
  validateFile,
  getFilePathFromUrl,
  STORAGE_BUCKETS,
  MAX_FILE_SIZES,
  ALLOWED_FILE_TYPES,
} from "@/lib/storage";

const NANTUCKET_AREAS = [
  "Town",
  "Madaket",
  "Siasconset",
  "Surfside",
  "Mid Island",
  "All of Nantucket",
];

export default function VendorProfilePage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState<any>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState<VendorCategory | "">("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState<string[]>([""]);
  const [hourlyRate, setHourlyRate] = useState("");
  const [serviceArea, setServiceArea] = useState<string[]>([]);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [insuranceInfo, setInsuranceInfo] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);

  // Check for existing profile
  useEffect(() => {
    if (user && !authLoading) {
      fetchVendorProfile();
    }
  }, [user, authLoading]);

  const fetchVendorProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setExistingProfile(data);
      setBusinessName(data.business_name);
      setCategory(data.category);
      setDescription(data.description || "");
      setServices(data.services.length > 0 ? data.services : [""]);
      setHourlyRate(data.hourly_rate?.toString() || "");
      setServiceArea(data.service_area);
      setLicenseNumber(data.license_number || "");
      setInsuranceInfo(data.insurance_info || "");
      setPhotos(data.photos || []);
      setDocuments(data.documents || []);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (!user) return;

    // Validate file
    const validation = validateFile(file, ALLOWED_FILE_TYPES.PHOTOS, MAX_FILE_SIZES.PHOTO);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Upload file
    const result = await uploadFile({
      bucket: STORAGE_BUCKETS.VENDOR_PHOTOS,
      file,
      userId: user.id,
    });

    if (!result.success) {
      alert(result.error || 'Upload failed');
      return;
    }

    // Update local state
    const newPhotos = [...photos, result.url!];
    setPhotos(newPhotos);

    // Update database
    if (existingProfile) {
      await supabase
        .from('vendors')
        .update({ photos: newPhotos })
        .eq('user_id', user.id);
    }
  };

  const handlePhotoDelete = async (url: string) => {
    if (!user) return;

    const filePath = getFilePathFromUrl(url, STORAGE_BUCKETS.VENDOR_PHOTOS);
    if (filePath) {
      await deleteFile(STORAGE_BUCKETS.VENDOR_PHOTOS, filePath);
    }

    // Update local state
    const newPhotos = photos.filter(p => p !== url);
    setPhotos(newPhotos);

    // Update database
    if (existingProfile) {
      await supabase
        .from('vendors')
        .update({ photos: newPhotos })
        .eq('user_id', user.id);
    }
  };

  const handleDocumentUpload = async (file: File) => {
    if (!user) return;

    // Validate file
    const validation = validateFile(file, ALLOWED_FILE_TYPES.DOCUMENTS, MAX_FILE_SIZES.DOCUMENT);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Upload file
    const result = await uploadFile({
      bucket: STORAGE_BUCKETS.VENDOR_DOCUMENTS,
      file,
      userId: user.id,
    });

    if (!result.success) {
      alert(result.error || 'Upload failed');
      return;
    }

    // Update local state
    const newDocuments = [...documents, result.url!];
    setDocuments(newDocuments);

    // Update database
    if (existingProfile) {
      await supabase
        .from('vendors')
        .update({ documents: newDocuments })
        .eq('user_id', user.id);
    }
  };

  const handleDocumentDelete = async (url: string) => {
    if (!user) return;

    const filePath = getFilePathFromUrl(url, STORAGE_BUCKETS.VENDOR_DOCUMENTS);
    if (filePath) {
      await deleteFile(STORAGE_BUCKETS.VENDOR_DOCUMENTS, filePath);
    }

    // Update local state
    const newDocuments = documents.filter(d => d !== url);
    setDocuments(newDocuments);

    // Update database
    if (existingProfile) {
      await supabase
        .from('vendors')
        .update({ documents: newDocuments })
        .eq('user_id', user.id);
    }
  };

  const handleAddService = () => {
    setServices([...services, ""]);
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...services];
    newServices[index] = value;
    setServices(newServices);
  };

  const toggleServiceArea = (area: string) => {
    if (serviceArea.includes(area)) {
      setServiceArea(serviceArea.filter((a) => a !== area));
    } else {
      setServiceArea([...serviceArea, area]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validate
      if (!businessName || !category || !description) {
        throw new Error("Please fill in all required fields");
      }

      if (description.length < 50) {
        throw new Error("Description must be at least 50 characters");
      }

      const filteredServices = services.filter((s) => s.trim() !== "");
      if (filteredServices.length === 0) {
        throw new Error("Please add at least one service");
      }

      if (serviceArea.length === 0) {
        throw new Error("Please select at least one service area");
      }

      const profileData = {
        user_id: user!.id,
        business_name: businessName,
        category,
        description,
        services: filteredServices,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
        service_area: serviceArea,
        license_number: licenseNumber || null,
        insurance_info: insuranceInfo || null,
      };

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from("vendors")
          .update(profileData)
          .eq("id", existingProfile.id);

        if (error) throw error;

        setMessage({
          type: "success",
          text: "Profile updated successfully! Next, complete your Stripe Connect onboarding.",
        });
      } else {
        // Create new profile
        const { error } = await supabase.from("vendors").insert(profileData);

        if (error) throw error;

        setMessage({
          type: "success",
          text: "Profile created successfully! Next, complete your Stripe Connect onboarding.",
        });
      }

      // Redirect to Stripe Connect onboarding after a delay
      setTimeout(() => {
        router.push("/vendor/onboarding");
      }, 2000);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to save profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sand-600">Loading...</p>
      </div>
    );
  }

  if (!user || profile?.role !== "vendor") {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-red-600">You must be logged in as a vendor to access this page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ocean-900">
          {existingProfile ? "Edit" : "Create"} Vendor Profile
        </h1>
        <p className="text-sand-600 mt-2">
          Set up your business profile to start receiving booking requests from Nantucket homeowners
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Tell homeowners about your business and the services you offer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="businessName">
                Business Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., Nantucket Plumbing Services"
                required
                disabled={loading}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as VendorCategory)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                disabled={loading}
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
                Business Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your business, experience, and what makes you stand out (minimum 50 characters)"
                rows={5}
                required
                disabled={loading}
              />
              <p className="text-xs text-sand-500">
                {description.length}/1000 characters (minimum 50)
              </p>
            </div>

            {/* Services */}
            <div className="space-y-2">
              <Label>
                Services Offered <span className="text-red-500">*</span>
              </Label>
              {services.map((service, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={service}
                    onChange={(e) => handleServiceChange(index, e.target.value)}
                    placeholder="e.g., Emergency repairs, installations, maintenance"
                    disabled={loading}
                  />
                  {services.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleRemoveService(index)}
                      disabled={loading}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddService}
                disabled={loading}
              >
                + Add Service
              </Button>
            </div>

            {/* Hourly Rate */}
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate (Optional)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sand-600">$</span>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="75"
                  className="pl-7"
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-sand-500">
                Leave blank if you prefer to quote per project
              </p>
            </div>

            {/* Service Area */}
            <div className="space-y-2">
              <Label>
                Service Areas <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {NANTUCKET_AREAS.map((area) => (
                  <Badge
                    key={area}
                    variant={serviceArea.includes(area) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => !loading && toggleServiceArea(area)}
                  >
                    {area}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-sand-500">
                Select all areas where you provide services
              </p>
            </div>

            {/* License Number */}
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number (Optional)</Label>
              <Input
                id="licenseNumber"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="e.g., MA-12345"
                disabled={loading}
              />
            </div>

            {/* Insurance Info */}
            <div className="space-y-2">
              <Label htmlFor="insuranceInfo">Insurance Information (Optional)</Label>
              <Textarea
                id="insuranceInfo"
                value={insuranceInfo}
                onChange={(e) => setInsuranceInfo(e.target.value)}
                placeholder="e.g., General liability insurance, $1M coverage"
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Business Photos */}
            <FileUpload
              label="Business Photos"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              maxSize={MAX_FILE_SIZES.PHOTO}
              maxFiles={5}
              currentFiles={photos}
              onUpload={handlePhotoUpload}
              onDelete={handlePhotoDelete}
              disabled={loading}
              preview={true}
              helperText="Upload up to 5 photos (JPEG, PNG, WebP - max 5MB each)"
            />

            {/* License & Insurance Documents */}
            <FileUpload
              label="License & Insurance Documents"
              accept="application/pdf,image/jpeg,image/jpg,image/png"
              maxSize={MAX_FILE_SIZES.DOCUMENT}
              maxFiles={3}
              currentFiles={documents}
              onUpload={handleDocumentUpload}
              onDelete={handleDocumentDelete}
              disabled={loading}
              preview={false}
              helperText="Upload license and insurance documents (PDF, JPEG, PNG - max 10MB each)"
            />

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

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Saving..." : existingProfile ? "Update Profile" : "Create Profile"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/vendor/dashboard")}
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
