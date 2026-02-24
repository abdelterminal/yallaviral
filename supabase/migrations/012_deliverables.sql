-- Deliverables table: tracks files uploaded by admins for specific bookings
CREATE TABLE IF NOT EXISTS deliverables (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    file_type TEXT,
    uploaded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;

-- Users can view deliverables for their own bookings
CREATE POLICY "Users can view own deliverables" ON deliverables
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM bookings WHERE bookings.id = deliverables.booking_id AND bookings.user_id = auth.uid())
    );

-- Admins can do everything with deliverables
CREATE POLICY "Admins can view all deliverables" ON deliverables
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

CREATE POLICY "Admins can insert deliverables" ON deliverables
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

CREATE POLICY "Admins can delete deliverables" ON deliverables
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );
