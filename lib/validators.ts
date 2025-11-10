import { z } from "zod";
import { VENDOR_CATEGORIES } from "./types";

// Vendor Profile Validation Schema
export const vendorProfileSchema = z.object({
  business_name: z.string().min(2, "Business name must be at least 2 characters"),
  category: z.enum(VENDOR_CATEGORIES, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  services: z
    .array(z.string())
    .min(1, "Please add at least one service"),
  hourly_rate: z
    .number()
    .min(0, "Hourly rate must be positive")
    .optional()
    .nullable(),
  service_area: z
    .array(z.string())
    .min(1, "Please add at least one service area"),
  license_number: z.string().optional(),
  insurance_info: z.string().optional(),
});

export type VendorProfileFormData = z.infer<typeof vendorProfileSchema>;

// Booking Request Validation Schema
export const bookingRequestSchema = z.object({
  vendor_id: z.string().uuid("Invalid vendor ID"),
  service_type: z.string().min(1, "Please select a service"),
  description: z
    .string()
    .min(20, "Please provide more details (at least 20 characters)"),
  preferred_date: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, "Preferred date must be today or in the future"),
});

export type BookingRequestFormData = z.infer<typeof bookingRequestSchema>;

// Review Validation Schema
export const reviewSchema = z.object({
  booking_id: z.string().uuid("Invalid booking ID"),
  vendor_id: z.string().uuid("Invalid vendor ID"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must not exceed 5"),
  comment: z.string().max(500, "Comment must not exceed 500 characters").optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
