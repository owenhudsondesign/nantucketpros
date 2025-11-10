-- Add payment tracking fields to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Add index for payment_status
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);

-- Add index for stripe_payment_intent_id
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_payment_intent ON bookings(stripe_payment_intent_id);
