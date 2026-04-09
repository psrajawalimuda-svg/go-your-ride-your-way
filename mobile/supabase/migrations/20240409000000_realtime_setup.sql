-- Enable PostGIS for radius searches
create extension if not exists postgis;

-- 1. Tables Setup
-- Profiles for users (passengers/drivers)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text check (role in ('passenger', 'driver', 'dispatch')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Driver details
create table if not exists public.drivers (
  id uuid references public.profiles(id) on delete cascade primary key,
  vehicle_details jsonb,
  status text default 'offline' check (status in ('online', 'offline', 'busy')),
  last_heartbeat timestamp with time zone default timezone('utc'::text, now()),
  rating numeric default 5.0,
  is_active boolean default true
);

-- Realtime Driver Locations
create table if not exists public.driver_locations (
  id uuid default gen_random_uuid() primary key,
  driver_id uuid references public.drivers(id) on delete cascade not null,
  location geography(point) not null,
  heading numeric,
  speed numeric,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trips
create table if not exists public.trips (
  id uuid default gen_random_uuid() primary key,
  passenger_id uuid references public.profiles(id) not null,
  driver_id uuid references public.drivers(id),
  pickup_location geography(point) not null,
  dropoff_location geography(point) not null,
  status text default 'pending' check (status in ('pending', 'accepted', 'in-progress', 'completed', 'cancelled')),
  fare numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Dispatch Events
create table if not exists public.dispatch_events (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  driver_id uuid references public.drivers(id),
  event_type text check (event_type in ('new_request', 'driver_assigned', 'driver_rejected', 'timeout')),
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Realtime
alter publication supabase_realtime add table public.driver_locations;
alter publication supabase_realtime add table public.trips;
alter publication supabase_realtime add table public.dispatch_events;

-- 3. Row-Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.drivers enable row level security;
alter table public.driver_locations enable row level security;
alter table public.trips enable row level security;
alter table public.dispatch_events enable row level security;

-- Profiles: Users can view all profiles, but only update their own
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Drivers: viewable by all, but only drivers can update their own status
create policy "Drivers viewable by all" on public.drivers for select using (true);
create policy "Drivers can update own status" on public.drivers for update using (auth.uid() = id);

-- Driver Locations: viewable by everyone (for tracking), but only owner can insert
create policy "Driver locations viewable by all" on public.driver_locations for select using (true);
create policy "Drivers can insert own location" on public.driver_locations for insert with check (auth.uid() = driver_id);

-- Trips: passengers see their own trips, drivers see assigned trips
create policy "Passengers view own trips" on public.trips for select using (auth.uid() = passenger_id);
create policy "Drivers view assigned trips" on public.trips for select using (auth.uid() = driver_id);
create policy "Passengers can create trips" on public.trips for insert with check (auth.uid() = passenger_id);
create policy "Drivers can update assigned trips" on public.trips for update using (auth.uid() = driver_id);

-- Dispatch Events: secure routing
create policy "Drivers see relevant dispatch events" on public.dispatch_events for select using (
  auth.uid() = driver_id or 
  exists (select 1 from public.trips where id = trip_id and passenger_id = auth.uid())
);

-- 4. Throttling and Cleanup
-- Function to mark drivers offline after heartbeat timeout
create or replace function public.cleanup_offline_drivers()
returns void as $$
begin
  update public.drivers
  set status = 'offline'
  where status != 'offline'
  and last_heartbeat < now() - interval '60 seconds';
end;
$$ language plpgsql security definer;

-- Trigger to update trip timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_trips_updated_at
  before update on public.trips
  for each row execute function public.handle_updated_at();

-- RPC to find nearby drivers
create or replace function public.find_nearby_drivers(pickup_lat numeric, pickup_lng numeric, radius_meters numeric)
returns table (id uuid, distance double precision) as $$
begin
  return query
  select 
    d.id,
    st_distance(
      l.location,
      st_setsrid(st_makepoint(pickup_lng, pickup_lat), 4326)::geography
    ) as distance
  from public.drivers d
  join lateral (
    select location from public.driver_locations 
    where driver_id = d.id 
    order by timestamp desc limit 1
  ) l on true
  where d.status = 'online'
  and st_dwithin(
    l.location,
    st_setsrid(st_makepoint(pickup_lng, pickup_lat), 4326)::geography,
    radius_meters
  );
end;
$$ language plpgsql security definer;
