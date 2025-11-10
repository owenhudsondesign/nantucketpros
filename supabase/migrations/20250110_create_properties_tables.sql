-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Nantucket',
  state TEXT NOT NULL DEFAULT 'MA',
  zip_code TEXT NOT NULL,
  notes TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create property_vendors junction table for favorites and recurring services
CREATE TABLE IF NOT EXISTS property_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_favorite BOOLEAN DEFAULT false,
  is_recurring BOOLEAN DEFAULT false,
  recurring_schedule TEXT, -- JSON string with schedule details
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, vendor_id)
);

-- Add property_id to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id) ON DELETE SET NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_is_primary ON properties(is_primary);
CREATE INDEX IF NOT EXISTS idx_property_vendors_property_id ON property_vendors(property_id);
CREATE INDEX IF NOT EXISTS idx_property_vendors_vendor_id ON property_vendors(vendor_id);
CREATE INDEX IF NOT EXISTS idx_property_vendors_user_id ON property_vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_property_vendors_is_favorite ON property_vendors(is_favorite);
CREATE INDEX IF NOT EXISTS idx_property_vendors_is_recurring ON property_vendors(is_recurring);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_vendors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for properties
CREATE POLICY "Users can view their own properties"
  ON properties FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties"
  ON properties FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties"
  ON properties FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for property_vendors
CREATE POLICY "Users can view their own property vendors"
  ON property_vendors FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own property vendors"
  ON property_vendors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own property vendors"
  ON property_vendors FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own property vendors"
  ON property_vendors FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_vendors_updated_at
  BEFORE UPDATE ON property_vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
