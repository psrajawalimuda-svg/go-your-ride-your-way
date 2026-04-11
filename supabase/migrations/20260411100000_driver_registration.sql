
-- Driver applications table for registration flow
CREATE TABLE IF NOT EXISTS public.driver_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text REFERENCES public.app_users(id),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  
  -- License Info
  license_number text NOT NULL,
  license_expiry date NOT NULL,
  
  -- Vehicle Info
  vehicle_type text NOT NULL, -- 'bike', 'car', etc.
  vehicle_model text NOT NULL,
  vehicle_plate text NOT NULL,
  vehicle_year integer NOT NULL,
  
  -- Document URLs (Stored in Supabase Storage)
  ktp_url text,
  stnk_url text,
  license_url text,
  vehicle_photo_url text,
  
  -- Status
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  admin_notes text,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS for driver_applications
ALTER TABLE public.driver_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications" 
  ON public.driver_applications FOR SELECT 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own applications" 
  ON public.driver_applications FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Admins can view all applications" 
  ON public.driver_applications FOR SELECT 
  USING (true); -- Simplified for now, should check admin role

-- Storage Bucket setup (Note: Bucket creation usually done via Dashboard or API, but we'll assume it exists or can be managed)
-- Suggested bucket name: 'driver-documents'
