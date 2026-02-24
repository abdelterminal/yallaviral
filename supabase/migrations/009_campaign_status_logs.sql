-- Campaign status tracking table: replaces hardcoded timeline steps
CREATE TABLE IF NOT EXISTS campaign_status_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('order_placed', 'scripting', 'filming', 'editing', 'ready')),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE campaign_status_logs ENABLE ROW LEVEL SECURITY;

-- Users can view status logs for their own bookings
CREATE POLICY "Users can view own campaign logs" ON campaign_status_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM bookings WHERE bookings.id = campaign_status_logs.booking_id AND bookings.user_id = auth.uid())
    );

-- Admins can view and insert status logs for any booking
CREATE POLICY "Admins can view all campaign logs" ON campaign_status_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

CREATE POLICY "Admins can insert campaign logs" ON campaign_status_logs
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

-- Auto-insert "order_placed" log when a booking is created
CREATE OR REPLACE FUNCTION auto_create_status_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO campaign_status_logs (booking_id, status, note)
    VALUES (NEW.id, 'order_placed', 'Campaign request submitted');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER booking_created_status_log
    AFTER INSERT ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION auto_create_status_log();
