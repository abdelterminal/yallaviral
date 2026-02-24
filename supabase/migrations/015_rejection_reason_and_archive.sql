-- Add rejection tracking columns to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;

-- Create rejection_logs table (permanent archive)
CREATE TABLE IF NOT EXISTS rejection_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL,
    user_id UUID NOT NULL,
    resource_name TEXT,
    total_price NUMERIC,
    rejection_reason TEXT NOT NULL,
    rejected_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on rejection_logs
ALTER TABLE rejection_logs ENABLE ROW LEVEL SECURITY;

-- Admins can read all rejection logs
CREATE POLICY "Admins can read rejection_logs"
    ON rejection_logs FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

-- Function to archive and delete rejected bookings older than 48 hours
CREATE OR REPLACE FUNCTION cleanup_rejected_bookings()
RETURNS void AS $$
BEGIN
    -- Archive to rejection_logs
    INSERT INTO rejection_logs (booking_id, user_id, resource_name, total_price, rejection_reason, rejected_at)
    SELECT
        b.id,
        b.user_id,
        r.name,
        b.total_price,
        b.rejection_reason,
        b.rejected_at
    FROM bookings b
    LEFT JOIN resources r ON r.id = b.resource_id
    WHERE b.status = 'rejected'
      AND b.rejected_at IS NOT NULL
      AND b.rejected_at < NOW() - INTERVAL '48 hours';

    -- Delete archived bookings
    DELETE FROM bookings
    WHERE status = 'rejected'
      AND rejected_at IS NOT NULL
      AND rejected_at < NOW() - INTERVAL '48 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- NOTE: To schedule automatic cleanup, run this in the Supabase SQL editor
-- after enabling the pg_cron extension:
--
-- SELECT cron.schedule(
--     'cleanup-rejected-bookings',
--     '0 */6 * * *',  -- Every 6 hours
--     'SELECT cleanup_rejected_bookings()'
-- );
