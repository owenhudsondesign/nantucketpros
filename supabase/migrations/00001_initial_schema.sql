-- =============================================================================
-- NantucketPros Database Schema
-- =============================================================================
-- This migration creates the complete database schema for NantucketPros
-- including tables, indexes, RLS policies, and functions
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE user_role AS ENUM ('homeowner', 'vendor', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- =============================================================================
-- TABLES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Users Table
-- -----------------------------------------------------------------------------
-- Extends Supabase auth.users with additional profile information
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'homeowner',
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster role-based queries
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- -----------------------------------------------------------------------------
-- Vendors Table
-- -----------------------------------------------------------------------------
-- Stores vendor-specific profile information and business details
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  services TEXT[] NOT NULL DEFAULT '{}',
  hourly_rate DECIMAL(10,2),
  service_area TEXT[] NOT NULL DEFAULT '{}',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  license_number TEXT,
  insurance_info TEXT,
  photos TEXT[] NOT NULL DEFAULT '{}',
  stripe_account_id TEXT,
  stripe_onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for vendor discovery and filtering
CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_vendors_category ON vendors(category);
CREATE INDEX idx_vendors_is_verified ON vendors(is_verified);
CREATE INDEX idx_vendors_created_at ON vendors(created_at DESC);

-- -----------------------------------------------------------------------------
-- Bookings Table
-- -----------------------------------------------------------------------------
-- Tracks service requests and their lifecycle
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  preferred_date TIMESTAMPTZ NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  price DECIMAL(10,2),
  stripe_payment_intent_id TEXT,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for booking queries
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_vendor_id ON bookings(vendor_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_preferred_date ON bookings(preferred_date);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);

-- -----------------------------------------------------------------------------
-- Messages Table
-- -----------------------------------------------------------------------------
-- Real-time messaging between customers and vendors for each booking
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for message queries
CREATE INDEX idx_messages_booking_id ON messages(booking_id, created_at);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_read ON messages(read) WHERE read = FALSE;

-- -----------------------------------------------------------------------------
-- Reviews Table
-- -----------------------------------------------------------------------------
-- Customer reviews and ratings for vendors after service completion
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE UNIQUE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for review queries
CREATE INDEX idx_reviews_vendor_id ON reviews(vendor_id, created_at DESC);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- -----------------------------------------------------------------------------
-- Admin Settings Table
-- -----------------------------------------------------------------------------
-- Platform-wide configuration managed by admins
CREATE TABLE admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for settings lookup
CREATE INDEX idx_admin_settings_key ON admin_settings(key);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Update timestamp function
-- -----------------------------------------------------------------------------
-- Automatically updates the updated_at column on row updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON admin_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- Get vendor average rating function
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_vendor_average_rating(vendor_uuid UUID)
RETURNS DECIMAL AS $$
  SELECT COALESCE(AVG(rating), 0)::DECIMAL(3,2)
  FROM reviews
  WHERE vendor_id = vendor_uuid;
$$ LANGUAGE SQL STABLE;

-- -----------------------------------------------------------------------------
-- Get vendor review count function
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_vendor_review_count(vendor_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM reviews
  WHERE vendor_id = vendor_uuid;
$$ LANGUAGE SQL STABLE;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Users Table Policies
-- -----------------------------------------------------------------------------

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- -----------------------------------------------------------------------------
-- Vendors Table Policies
-- -----------------------------------------------------------------------------

-- Anyone can view verified vendors (public directory)
CREATE POLICY "Anyone can view verified vendors"
  ON vendors FOR SELECT
  USING (is_verified = TRUE);

-- Vendors can view their own profile even if unverified
CREATE POLICY "Vendors can view own profile"
  ON vendors FOR SELECT
  USING (user_id = auth.uid());

-- Vendors can insert their own profile
CREATE POLICY "Vendors can insert own profile"
  ON vendors FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Vendors can update their own profile
CREATE POLICY "Vendors can update own profile"
  ON vendors FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins can view all vendors
CREATE POLICY "Admins can view all vendors"
  ON vendors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update any vendor (for verification)
CREATE POLICY "Admins can update vendors"
  ON vendors FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- -----------------------------------------------------------------------------
-- Bookings Table Policies
-- -----------------------------------------------------------------------------

-- Customers can view their own bookings
CREATE POLICY "Customers can view own bookings"
  ON bookings FOR SELECT
  USING (customer_id = auth.uid());

-- Vendors can view bookings for their services
CREATE POLICY "Vendors can view own bookings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = bookings.vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- Customers can create bookings
CREATE POLICY "Customers can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (customer_id = auth.uid());

-- Customers can update their pending bookings
CREATE POLICY "Customers can update pending bookings"
  ON bookings FOR UPDATE
  USING (customer_id = auth.uid() AND status = 'pending')
  WITH CHECK (customer_id = auth.uid());

-- Vendors can update bookings for their services
CREATE POLICY "Vendors can update own bookings"
  ON bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM vendors
      WHERE vendors.id = bookings.vendor_id
      AND vendors.user_id = auth.uid()
    )
  );

-- Admins can view and update all bookings
CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all bookings"
  ON bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- -----------------------------------------------------------------------------
-- Messages Table Policies
-- -----------------------------------------------------------------------------

-- Users can view messages for their bookings
CREATE POLICY "Users can view messages for their bookings"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = messages.booking_id
      AND (
        bookings.customer_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM vendors
          WHERE vendors.id = bookings.vendor_id
          AND vendors.user_id = auth.uid()
        )
      )
    )
  );

-- Users can send messages for their bookings
CREATE POLICY "Users can send messages for their bookings"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = messages.booking_id
      AND (
        bookings.customer_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM vendors
          WHERE vendors.id = bookings.vendor_id
          AND vendors.user_id = auth.uid()
        )
      )
    )
  );

-- Users can update their own messages (mark as read)
CREATE POLICY "Users can update messages in their bookings"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = messages.booking_id
      AND (
        bookings.customer_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM vendors
          WHERE vendors.id = bookings.vendor_id
          AND vendors.user_id = auth.uid()
        )
      )
    )
  );

-- -----------------------------------------------------------------------------
-- Reviews Table Policies
-- -----------------------------------------------------------------------------

-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

-- Customers can create reviews for completed bookings
CREATE POLICY "Customers can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (
    customer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = reviews.booking_id
      AND bookings.customer_id = auth.uid()
      AND bookings.status = 'completed'
    )
  );

-- Customers can update their own reviews
CREATE POLICY "Customers can update own reviews"
  ON reviews FOR UPDATE
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

-- Customers can delete their own reviews
CREATE POLICY "Customers can delete own reviews"
  ON reviews FOR DELETE
  USING (customer_id = auth.uid());

-- -----------------------------------------------------------------------------
-- Admin Settings Table Policies
-- -----------------------------------------------------------------------------

-- Anyone can view admin settings (for public configs like commission rate)
CREATE POLICY "Anyone can view admin settings"
  ON admin_settings FOR SELECT
  USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can manage settings"
  ON admin_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- INITIAL DATA
-- =============================================================================

-- Insert default platform settings
INSERT INTO admin_settings (key, value, description) VALUES
  ('commission_rate', '0.15', 'Platform commission rate (15%)'),
  ('require_vendor_verification', 'true', 'Require admin verification before vendors appear in search'),
  ('booking_cancellation_hours', '24', 'Minimum hours before booking to allow cancellation'),
  ('payout_delay_days', '7', 'Days to wait before releasing funds to vendor after completion');

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE users IS 'User profiles extending Supabase auth with role-based access';
COMMENT ON TABLE vendors IS 'Vendor business profiles and verification status';
COMMENT ON TABLE bookings IS 'Service booking requests and their lifecycle';
COMMENT ON TABLE messages IS 'Real-time messaging between customers and vendors';
COMMENT ON TABLE reviews IS 'Customer reviews and ratings for vendors';
COMMENT ON TABLE admin_settings IS 'Platform-wide configuration settings';

COMMENT ON COLUMN vendors.is_verified IS 'Admin-approved verification status - only verified vendors appear in public search';
COMMENT ON COLUMN bookings.status IS 'Booking lifecycle: pending -> confirmed -> completed (or cancelled at any stage)';
COMMENT ON COLUMN bookings.stripe_payment_intent_id IS 'Stripe Payment Intent ID for processing payments';
