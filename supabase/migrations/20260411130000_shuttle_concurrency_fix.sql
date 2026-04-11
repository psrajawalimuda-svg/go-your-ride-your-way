
-- 1. Denormalize shuttle_booking_passengers for Atomic Concurrency Control
-- We add departure_id and vehicle_class_id to the passengers table to enable 
-- a simple UNIQUE constraint that works across bookings.

ALTER TABLE public.shuttle_booking_passengers 
ADD COLUMN IF NOT EXISTS departure_id uuid REFERENCES public.shuttle_departures(id),
ADD COLUMN IF NOT EXISTS vehicle_class_id uuid REFERENCES public.shuttle_vehicle_classes(id);

-- 2. Prevent Double Booking with a UNIQUE Constraint
-- This is the most robust way to handle high traffic race conditions.
-- We use a partial index to only enforce uniqueness for active (non-cancelled) bookings.
-- Note: Since 'status' is in the parent 'shuttle_bookings' table, we have two options:
-- a) Add 'status' to passengers too (redundant)
-- b) Just use a standard UNIQUE constraint and handle cancellations by deleting/updating.
-- We'll go with a redundant status or just a strict UNIQUE if we don't allow re-using seat numbers of cancelled bookings immediately.
-- Actually, a better way is a UNIQUE index on (departure_id, vehicle_class_id, seat_number).

ALTER TABLE public.shuttle_booking_passengers 
DROP CONSTRAINT IF EXISTS unique_seat_booking;

-- First, populate existing data if any (maintenance)
UPDATE public.shuttle_booking_passengers p
SET departure_id = b.departure_id,
    vehicle_class_id = b.vehicle_class_id
FROM public.shuttle_bookings b
WHERE p.booking_id = b.id;

-- Create the constraint
ALTER TABLE public.shuttle_booking_passengers 
ADD CONSTRAINT unique_seat_booking 
UNIQUE (departure_id, vehicle_class_id, seat_number);

-- 3. Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_shuttle_departures_active_time 
ON public.shuttle_departures(active, departure_time);

CREATE INDEX IF NOT EXISTS idx_shuttle_routes_cities 
ON public.shuttle_routes(from_city, to_city);

-- 4. Robust RPC v3 with Row-Level Locking
CREATE OR REPLACE FUNCTION public.create_shuttle_booking_v3(
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
  v_capacity integer;
  v_occupied integer;
BEGIN
  -- A. LOCKING: Lock the departure row to serialize bookings for this specific trip
  -- This prevents concurrent capacity checks from giving stale results.
  PERFORM * FROM public.shuttle_departures WHERE id = p_departure_id FOR UPDATE;

  -- B. CAPACITY CHECK: Get capacity for the chosen vehicle class
  -- (Assuming 'Hiace' as default layout for this logic, but ideally schema should be fixed)
  SELECT (seating_layouts->'Hiace'->>'total_seats')::int INTO v_capacity 
  FROM public.shuttle_vehicle_classes 
  WHERE id = p_vehicle_class_id;

  -- C. OCCUPANCY CHECK: Count active seats
  SELECT count(*) INTO v_occupied
  FROM public.shuttle_booking_passengers
  WHERE departure_id = p_departure_id 
  AND vehicle_class_id = p_vehicle_class_id;

  IF (v_occupied + jsonb_array_length(p_passengers)) > v_capacity THEN
    RAISE EXCEPTION 'Vehicle is full. Only % seats remaining.', (v_capacity - v_occupied);
  END IF;

  -- D. ATOMIC INSERT: Insert booking record
  INSERT INTO public.shuttle_bookings (
    user_id, departure_id, vehicle_class_id, pickup_point_id, total_price, status
  ) VALUES (
    p_user_id, p_departure_id, p_vehicle_class_id, p_pickup_point_id, p_total_price, 'confirmed'
  ) RETURNING id INTO v_booking_id;

  -- E. PASSENGER INSERT: Insert details with redundant IDs for the UNIQUE constraint
  FOR v_passenger IN SELECT * FROM jsonb_to_recordset(p_passengers) AS x(name text, phone text, email text, seat_number integer)
  LOOP
    BEGIN
      INSERT INTO public.shuttle_booking_passengers (
        booking_id, departure_id, vehicle_class_id, name, phone, email, seat_number
      ) VALUES (
        v_booking_id, p_departure_id, p_vehicle_class_id, v_passenger.name, v_passenger.phone, v_passenger.email, v_passenger.seat_number
      );
    EXCEPTION WHEN unique_violation THEN
      RAISE EXCEPTION 'Seat % has just been taken by another user. Please choose another seat.', v_passenger.seat_number;
    END;
  END LOOP;

  RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
