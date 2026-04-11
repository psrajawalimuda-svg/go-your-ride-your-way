
-- 1. Re-structure shuttle_bookings for normalized data
DROP TABLE IF EXISTS public.shuttle_bookings CASCADE;
CREATE TABLE public.shuttle_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text REFERENCES public.app_users(id),
  departure_id uuid NOT NULL REFERENCES public.shuttle_departures(id),
  vehicle_class_id uuid NOT NULL REFERENCES public.shuttle_vehicle_classes(id),
  pickup_point_id uuid NOT NULL REFERENCES public.shuttle_pickup_points(id),
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  total_price integer NOT NULL,
  payment_id text, -- references transactions table
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. New table for booking passengers (multi-passenger support)
CREATE TABLE public.shuttle_booking_passengers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.shuttle_bookings(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  seat_number integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. RLS for security
ALTER TABLE public.shuttle_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shuttle_booking_passengers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own shuttle bookings"
  ON public.shuttle_bookings FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own shuttle bookings"
  ON public.shuttle_bookings FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own booking passengers"
  ON public.shuttle_booking_passengers FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.shuttle_bookings
    WHERE id = shuttle_booking_passengers.booking_id
    AND user_id = auth.uid()::text
  ));

CREATE POLICY "Users can insert booking passengers"
  ON public.shuttle_booking_passengers FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.shuttle_bookings
    WHERE id = shuttle_booking_passengers.booking_id
    AND user_id = auth.uid()::text
  ));

-- 4. RPC for Transactional Booking (Atomic seat update + booking creation)
CREATE OR REPLACE FUNCTION public.create_shuttle_booking(
  p_user_id text,
  p_departure_id uuid,
  p_vehicle_class_id uuid,
  p_pickup_point_id uuid,
  p_total_price integer,
  p_passengers jsonb -- Array of {name, phone, email, seat_number}
) RETURNS uuid AS $$
DECLARE
  v_booking_id uuid;
  v_passenger record;
  v_capacity integer;
  v_occupied integer;
  v_layout jsonb;
  v_num_passengers integer;
BEGIN
  -- Get capacity for the vehicle class
  -- (This is a bit simplified, usually linked to a specific vehicle instance)
  SELECT (seating_layouts->'Hiace'->>'total_seats')::int INTO v_capacity 
  FROM public.shuttle_vehicle_classes 
  WHERE id = p_vehicle_class_id;

  -- Count current passengers for this departure + class
  SELECT count(*) INTO v_occupied
  FROM public.shuttle_booking_passengers p
  JOIN public.shuttle_bookings b ON b.id = p.booking_id
  WHERE b.departure_id = p_departure_id 
  AND b.vehicle_class_id = p_vehicle_class_id
  AND b.status != 'cancelled';

  v_num_passengers := jsonb_array_length(p_passengers);

  IF (v_occupied + v_num_passengers) > v_capacity THEN
    RAISE EXCEPTION 'Not enough seats available';
  END IF;

  -- Insert booking
  INSERT INTO public.shuttle_bookings (
    user_id, departure_id, vehicle_class_id, pickup_point_id, total_price, status
  ) VALUES (
    p_user_id, p_departure_id, p_vehicle_class_id, p_pickup_point_id, p_total_price, 'confirmed'
  ) RETURNING id INTO v_booking_id;

  -- Insert passengers
  FOR v_passenger IN SELECT * FROM jsonb_to_recordset(p_passengers) AS x(name text, phone text, email text, seat_number integer)
  LOOP
    -- Check if seat is already taken
    IF EXISTS (
      SELECT 1 FROM public.shuttle_booking_passengers p
      JOIN public.shuttle_bookings b ON b.id = p.booking_id
      WHERE b.departure_id = p_departure_id 
      AND b.vehicle_class_id = p_vehicle_class_id
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
