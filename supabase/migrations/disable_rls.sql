-- Disable RLS on bookings for MVP to allow guest submissions
alter table bookings disable row level security;
