-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  brand_name text,
  phone text,
  role text default 'client' check (role in ('admin', 'client')),
  created_at timestamptz default now()
);

-- RESOURCES TABLE (Models, Studios, Gear)
create table if not exists resources (
  id uuid default uuid_generate_v4() primary key,
  type text check (type in ('model', 'studio', 'gear')),
  name text not null,
  hourly_rate int not null,
  image_url text,
  tags text[],
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz default now()
);

-- BOOKINGS TABLE
create table if not exists bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  resource_id uuid references resources(id) on delete set null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'rejected')),
  total_price int not null,
  created_at timestamptz default now()
);

-- SEED DATA
insert into resources (type, name, hourly_rate, image_url, tags) values
  ('model', 'Sara', 500, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', ARRAY['fashion', 'lifestyle']),
  ('model', 'Amine', 450, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', ARRAY['tech', 'casual']),
  ('model', 'Lina', 600, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', ARRAY['beauty', 'makeup']),
  ('studio', 'Podcast Room', 200, 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&fit=crop', ARRAY['sound-proof', '4-mics']),
  ('studio', 'Green Screen', 300, 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&fit=crop', ARRAY['lighting', 'spacious']),
  ('gear', 'Ring Light', 50, 'https://images.unsplash.com/photo-1550920405-2b414436c84c?w=400&fit=crop', ARRAY['basic']),
  ('gear', 'Sony A7 III', 150, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&fit=crop', ARRAY['camera', '4k']);

-- ROW LEVEL SECURITY (Simple for MVP)
alter table profiles enable row level security;
alter table resources enable row level security;
alter table bookings enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);

create policy "Resources are viewable by everyone" on resources for select using (true);

create policy "Users can view their own bookings" on bookings for select using (auth.uid() = user_id);
create policy "Users can insert their own bookings" on bookings for insert with check (auth.uid() = user_id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);
