-- Add documents field to vendors table for storing license/insurance document URLs
ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS documents TEXT[] NOT NULL DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN vendors.documents IS 'URLs to uploaded license and insurance documents';
