-- Admin RLS: allow admins to view all bookings
CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Admin RLS: allow admins to update any booking (confirm/reject)
CREATE POLICY "Admins can update all bookings" ON bookings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );
