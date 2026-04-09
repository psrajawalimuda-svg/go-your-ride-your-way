-- Core Schema Migration: Extensions, Enums, Tables, RLS, Audit, and Soft Deletes
-- 20240409000001_core_schema.sql

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. ENUMS
do $$ begin
    create type public.user_role as enum ('passenger', 'driver', 'dispatcher', 'admin');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type public.trip_status as enum ('pending', 'searching', 'accepted', 'arriving', 'in_progress', 'completed', 'cancelled', 'failed');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type public.payment_status as enum ('pending', 'processing', 'succeeded', 'failed', 'refunded');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type public.booking_type as enum ('instant', 'scheduled', 'shuttle');
exception
    when duplicate_object then null;
end $$;

-- 3. AUDIT TRAIL LOGIC
create table if not exists public.audit_logs (
    id uuid default uuid_generate_v4() primary key,
    table_name text not null,
    record_id uuid not null,
    action text not null,
    old_data jsonb,
    new_data jsonb,
    user_id uuid references auth.users(id),
    created_at timestamp with time zone default now()
);

create or replace function public.audit_trigger_func()
returns trigger as $$
begin
    if (tg_op = 'UPDATE') then
        insert into public.audit_logs (table_name, record_id, action, old_data, new_data, user_id)
        values (tg_table_name, new.id, tg_op, to_jsonb(old), to_jsonb(new), auth.uid());
        return new;
    elsif (tg_op = 'DELETE') then
        insert into public.audit_logs (table_name, record_id, action, old_data, user_id)
        values (tg_table_name, old.id, tg_op, to_jsonb(old), auth.uid());
        return old;
    elsif (tg_op = 'INSERT') then
        insert into public.audit_logs (table_name, record_id, action, new_data, user_id)
        values (tg_table_name, new.id, tg_op, to_jsonb(new), auth.uid());
        return new;
    end if;
    return null;
end;
$$ language plpgsql security definer;

-- 4. SOFT DELETE LOGIC
create or replace function public.soft_delete_func()
returns trigger as $$
begin
    new.deleted_at = now();
    return new;
end;
$$ language plpgsql;

-- 5. TABLES ENHANCEMENT

-- Update Profiles to use Enum and Soft Delete
alter table public.profiles add column if not exists deleted_at timestamp with time zone;
alter table public.profiles add column if not exists phone_number text unique;
alter table public.profiles add column if not exists updated_at timestamp with time zone default now();

-- Shuttle Module
create table if not exists public.shuttle_routes (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    start_location geography(point) not null,
    end_location geography(point) not null,
    stops jsonb, -- Array of stop locations and times
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone
);

create table if not exists public.shuttle_schedules (
    id uuid default uuid_generate_v4() primary key,
    route_id uuid references public.shuttle_routes(id) on delete cascade,
    departure_time time not null,
    days_of_week int[] not null, -- 0-6 (Sunday-Saturday)
    capacity int not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone
);

-- Booking Module (Extended from Trips or New for Scheduled/Shuttle)
create table if not exists public.bookings (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) not null,
    booking_type public.booking_type not null,
    scheduled_at timestamp with time zone,
    shuttle_schedule_id uuid references public.shuttle_schedules(id),
    pickup_location geography(point) not null,
    dropoff_location geography(point) not null,
    status public.trip_status default 'pending',
    metadata jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone
);

-- Payment Module
create table if not exists public.payments (
    id uuid default uuid_generate_v4() primary key,
    booking_id uuid references public.bookings(id),
    trip_id uuid references public.trips(id),
    user_id uuid references public.profiles(id) not null,
    amount numeric(10,2) not null,
    currency text default 'IDR',
    status public.payment_status default 'pending',
    payment_method text,
    transaction_id text unique,
    provider_response jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 6. INDEXES for Performance
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_bookings_user_id on public.bookings(user_id);
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_payments_booking_id on public.payments(booking_id);
create index if not exists idx_payments_user_id on public.payments(user_id);
create index if not exists idx_shuttle_routes_active on public.shuttle_routes(is_active) where deleted_at is null;

-- 7. RLS POLICIES (Additional)

-- Shuttle Routes: Viewable by all, managed by Admin/Dispatcher
alter table public.shuttle_routes enable row level security;
create policy "Shuttle routes viewable by all" on public.shuttle_routes for select using (deleted_at is null);
create policy "Admins can manage shuttle routes" on public.shuttle_routes 
    for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'dispatcher')));

-- Bookings: User view/create own, Driver/Admin view all relevant
alter table public.bookings enable row level security;
create policy "Users can view own bookings" on public.bookings for select using (auth.uid() = user_id);
create policy "Users can create own bookings" on public.bookings for insert with check (auth.uid() = user_id);
create policy "Admins view all bookings" on public.bookings for select 
    using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'dispatcher')));

-- Payments: User view own, Admin view all
alter table public.payments enable row level security;
create policy "Users can view own payments" on public.payments for select using (auth.uid() = user_id);
create policy "Admins view all payments" on public.payments for select 
    using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'dispatcher')));

-- 8. TRIGGERS
-- Audit triggers
create trigger audit_profiles after insert or update or delete on public.profiles for each row execute function public.audit_trigger_func();
create trigger audit_bookings after insert or update or delete on public.bookings for each row execute function public.audit_trigger_func();
create trigger audit_payments after insert or update or delete on public.payments for each row execute function public.audit_trigger_func();

-- Updated_at triggers
create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.handle_updated_at();
create trigger set_bookings_updated_at before update on public.bookings for each row execute function public.handle_updated_at();
create trigger set_payments_updated_at before update on public.payments for each row execute function public.handle_updated_at();
create trigger set_shuttle_routes_updated_at before update on public.shuttle_routes for each row execute function public.handle_updated_at();
