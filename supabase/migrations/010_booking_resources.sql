-- Join table for multi-model campaign bookings
-- Currently campaigns store models in metadata JSON; this provides proper relational tracking
CREATE TABLE IF NOT EXISTS booking_resources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
    resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
    quantity INT DEFAULT 1 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE booking_resources ENABLE ROW LEVEL SECURITY;

-- Users can view their own booking resources
CREATE POLICY "Users can view own booking resources" ON booking_resources
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booking_resources.booking_id AND bookings.user_id = auth.uid())
    );

-- Users can insert their own booking resources
CREATE POLICY "Users can insert own booking resources" ON booking_resources
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booking_resources.booking_id AND bookings.user_id = auth.uid())
    );

-- Admins can view all booking resources
CREATE POLICY "Admins can view all booking resources" ON booking_resources
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );
