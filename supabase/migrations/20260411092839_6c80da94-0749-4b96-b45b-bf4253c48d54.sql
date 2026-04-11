
CREATE TABLE public.app_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'passenger',
  status TEXT NOT NULL DEFAULT 'active',
  total_trips INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.drivers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle_class TEXT NOT NULL,
  vehicle_plate TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'offline',
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  total_trips INTEGER NOT NULL DEFAULT 0,
  approved BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.trips (
  id TEXT PRIMARY KEY,
  passenger_name TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  pickup TEXT NOT NULL,
  dropoff TEXT NOT NULL,
  vehicle_class TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  fare INTEGER NOT NULL DEFAULT 0,
  distance TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.shuttle_schedules (
  id TEXT PRIMARY KEY,
  from_city TEXT NOT NULL,
  to_city TEXT NOT NULL,
  departure TEXT NOT NULL,
  arrival TEXT NOT NULL,
  duration TEXT NOT NULL,
  price INTEGER NOT NULL,
  operator TEXT NOT NULL,
  total_seats INTEGER NOT NULL,
  available_seats INTEGER NOT NULL
);

CREATE TABLE public.shuttle_bookings (
  id TEXT PRIMARY KEY,
  passenger_name TEXT NOT NULL,
  route TEXT NOT NULL,
  departure TEXT NOT NULL,
  seats INTEGER NOT NULL DEFAULT 1,
  total_price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.transactions (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL,
  method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  related_to TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.promos (
  id TEXT PRIMARY KEY DEFAULT 'p' || extract(epoch from now())::text,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  gradient TEXT NOT NULL DEFAULT 'from-violet-500 to-purple-600',
  badge TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL
);

ALTER TABLE public.app_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.shuttle_schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.shuttle_bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.promos DISABLE ROW LEVEL SECURITY;
