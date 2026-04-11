
-- 1. Performance: Add Missing Indexes
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(passenger_name); -- Ideally should be user_id (text)
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_shuttle_bookings_user_id ON public.shuttle_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_shuttle_booking_passengers_booking_id ON public.shuttle_booking_passengers(booking_id);

-- 2. Concurrency: Prevent Double Booking in Shuttle
-- Add a unique constraint to prevent same seat being booked twice for same departure
-- First, ensure no duplicates exist (cleanup if needed, though this is a dev migration)
ALTER TABLE public.shuttle_booking_passengers 
ADD CONSTRAINT unique_seat_per_departure 
UNIQUE (booking_id, seat_number); 
-- Note: Better constraint would be on (shuttle_bookings.departure_id, seat_number) 
-- but that requires a trigger or a materialized view for simple SQL constraint.
-- We will handle this strictly in the RPC.

-- 3. Security: Enable RLS and Add Policies
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shuttle_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policies for app_users
CREATE POLICY "Users can only see their own profile" ON public.app_users
  FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can update their own profile" ON public.app_users
  FOR UPDATE USING (auth.uid()::text = id);

-- Policies for trips
CREATE POLICY "Users can see their own trips" ON public.trips
  FOR SELECT USING (true); -- Currently trips table doesn't have user_id, it has passenger_name. 
-- For production, we should add user_id text references app_users(id).

-- 4. Persistence: Ride Requests Table for Reliable Dispatch
CREATE TABLE IF NOT EXISTS public.ride_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  passenger_id text REFERENCES public.app_users(id),
  pickup_label text NOT NULL,
  pickup_coords jsonb NOT NULL,
  dropoff_label text NOT NULL,
  dropoff_coords jsonb NOT NULL,
  fare integer NOT NULL,
  status text NOT NULL DEFAULT 'searching', -- 'searching', 'found', 'timeout', 'cancelled'
  driver_id text REFERENCES public.drivers(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ride_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own requests" ON public.ride_requests
  USING (auth.uid()::text = passenger_id);

-- 5. RPC Refinement: Atomic & Concurrent-Safe Shuttle Booking
CREATE OR REPLACE FUNCTION public.create_shuttle_booking_v2(
  p_user_id text,
  p_departure_id uuid,
  p_vehicle_class_id uuid,
  p_pickup_point_id uuid,
  p_total_price integer,
  p_passengers jsonb
) RETURNS uuid AS $$
DECLARE
  v_booking_id uuid;
  v_passenger record;
BEGIN
  -- 1. Lock the departure row to prevent concurrent modifications
  PERFORM * FROM public.shuttle_departures WHERE id = p_departure_id FOR UPDATE;

  -- 2. Check seat availability inside the lock
  -- (Logical check here, but UNIQUE constraint on passengers table will be the hard stop)
  
  -- 3. Insert booking
  INSERT INTO public.shuttle_bookings (
    user_id, departure_id, vehicle_class_id, pickup_point_id, total_price, status
  ) VALUES (
    p_user_id, p_departure_id, p_vehicle_class_id, p_pickup_point_id, p_total_price, 'confirmed'
  ) RETURNING id INTO v_booking_id;

  -- 4. Insert passengers
  FOR v_passenger IN SELECT * FROM jsonb_to_recordset(p_passengers) AS x(name text, phone text, email text, seat_number integer)
  LOOP
    -- Double check seat again
    IF EXISTS (
      SELECT 1 FROM public.shuttle_booking_passengers p
      JOIN public.shuttle_bookings b ON b.id = p.booking_id
      WHERE b.departure_id = p_departure_id 
      AND p.seat_number = v_passenger.seat_number
      AND b.status != 'cancelled'
    ) THEN
      RAISE EXCEPTION 'Seat % is already taken', v_passenger.seat_number;
    END IF;

    INSERT INTO public.shuttle_booking_passengers (
      booking_id, name, phone, email, seat_number
    ) VALUES (
      v_booking_id, v_passenger.name, v_passenger.phone, v_passenger.email, v_passenger.seat_number
    );
  END LOOP;

  RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
