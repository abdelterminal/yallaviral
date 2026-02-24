-- Re-enable RLS on the bookings table
alter table bookings enable row level security;

-- Drop existing policies if they exist (just to be safe)
drop policy if exists "Users can view their own bookings" on bookings;
drop policy if exists "Users can insert their own bookings" on bookings;

-- Re-create secure policies
create policy "Users can view their own bookings" on bookings for select using (auth.uid() = user_id);
create policy "Users can insert their own bookings" on bookings for insert with check (auth.uid() = user_id);
