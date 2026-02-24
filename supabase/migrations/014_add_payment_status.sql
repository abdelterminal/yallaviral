-- Add payment_status column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid';

-- Add check constraint for valid payment statuses
ALTER TABLE bookings ADD CONSTRAINT bookings_payment_status_check
    CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed'));
