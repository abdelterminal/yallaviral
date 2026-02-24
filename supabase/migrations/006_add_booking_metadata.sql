-- Add metadata column to store campaign details like selected models and video style
alter table bookings add column if not exists metadata jsonb;
