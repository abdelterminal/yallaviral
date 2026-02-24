-- Admin RLS: allow admins to insert, update, and delete resources
-- Without these, the admin CRUD UI (ModelDialog, StudioDialog, etc.) silently fails

CREATE POLICY "Admins can insert resources" ON resources
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

CREATE POLICY "Admins can update resources" ON resources
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );

CREATE POLICY "Admins can delete resources" ON resources
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
    );
