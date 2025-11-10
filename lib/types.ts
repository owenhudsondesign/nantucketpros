// User Roles
export type UserRole = 'homeowner' | 'vendor' | 'admin';

// Database Types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      vendors: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          category: string;
          description: string | null;
          services: string[];
          hourly_rate: number | null;
          service_area: string[];
          is_verified: boolean;
          license_number: string | null;
          insurance_info: string | null;
          photos: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['vendors']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['vendors']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          customer_id: string;
          vendor_id: string;
          service_type: string;
          description: string;
          preferred_date: string;
          status: BookingStatus;
          price: number | null;
          stripe_payment_intent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          booking_id: string;
          sender_id: string;
          content: string;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          vendor_id: string;
          customer_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      admin_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['admin_settings']['Row'], 'id' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['admin_settings']['Insert']>;
      };
      properties: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          notes: string | null;
          is_primary: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['properties']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['properties']['Insert']>;
      };
      property_vendors: {
        Row: {
          id: string;
          property_id: string;
          vendor_id: string;
          user_id: string;
          is_favorite: boolean;
          is_recurring: boolean;
          recurring_schedule: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['property_vendors']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['property_vendors']['Insert']>;
      };
    };
  };
};

// Booking Status
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

// Vendor Categories
export const VENDOR_CATEGORIES = [
  'Plumbing',
  'Electrical',
  'HVAC',
  'Carpentry',
  'Painting',
  'Landscaping',
  'Roofing',
  'General Contracting',
  'Cleaning',
  'Pool & Spa',
  'Other',
] as const;

export type VendorCategory = typeof VENDOR_CATEGORIES[number];

// Form Types
export interface VendorProfileFormData {
  business_name: string;
  category: VendorCategory;
  description: string;
  services: string[];
  hourly_rate: number;
  service_area: string[];
  license_number?: string;
  insurance_info?: string;
}

export interface BookingRequestFormData {
  vendor_id: string;
  service_type: string;
  description: string;
  preferred_date: string;
}

export interface ReviewFormData {
  booking_id: string;
  vendor_id: string;
  rating: number;
  comment?: string;
}
