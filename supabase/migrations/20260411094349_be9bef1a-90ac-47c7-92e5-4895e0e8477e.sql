
-- shuttle_routes
CREATE TABLE public.shuttle_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  from_city text NOT NULL,
  to_city text NOT NULL,
  total_distance_m integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shuttle_routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to shuttle_routes" ON public.shuttle_routes FOR ALL USING (true) WITH CHECK (true);

-- shuttle_pickup_points
CREATE TABLE public.shuttle_pickup_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid NOT NULL REFERENCES public.shuttle_routes(id) ON DELETE CASCADE,
  sequence integer NOT NULL,
  name text NOT NULL,
  pickup_time text NOT NULL,
  distance_m integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shuttle_pickup_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to shuttle_pickup_points" ON public.shuttle_pickup_points FOR ALL USING (true) WITH CHECK (true);

-- shuttle_vehicle_classes
CREATE TABLE public.shuttle_vehicle_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  price_per_km integer NOT NULL,
  baggage_rules jsonb NOT NULL DEFAULT '[]'::jsonb,
  seating_layouts jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shuttle_vehicle_classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to shuttle_vehicle_classes" ON public.shuttle_vehicle_classes FOR ALL USING (true) WITH CHECK (true);

-- shuttle_departures
CREATE TABLE public.shuttle_departures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_label text NOT NULL,
  departure_time text NOT NULL,
  arrival_time text NOT NULL,
  route_id uuid NOT NULL REFERENCES public.shuttle_routes(id) ON DELETE CASCADE,
  driver_count integer NOT NULL DEFAULT 3,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shuttle_departures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to shuttle_departures" ON public.shuttle_departures FOR ALL USING (true) WITH CHECK (true);

-- Seed routes
INSERT INTO public.shuttle_routes (id, code, name, from_city, to_city, total_distance_m) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'A', 'Rayon A', 'Hermes Palace', 'KNO', 58250),
  ('b0000000-0000-0000-0000-000000000001', 'B', 'Rayon B', 'Cambridge', 'KNO', 65520),
  ('c0000000-0000-0000-0000-000000000001', 'C', 'Rayon C', 'Adi Mulia', 'Tol KNO', 31400),
  ('d0000000-0000-0000-0000-000000000001', 'D', 'Rayon D', 'Hotel TD Pardede', 'Kualanamu', 63600);

-- Seed Rayon A pickup points
INSERT INTO public.shuttle_pickup_points (route_id, sequence, name, pickup_time, distance_m) VALUES
  ('a0000000-0000-0000-0000-000000000001', 1, 'Hermes Palace', '06:00', 0),
  ('a0000000-0000-0000-0000-000000000001', 2, 'Kama Hotel', '06:05', 700),
  ('a0000000-0000-0000-0000-000000000001', 3, 'Travel Suite', '06:10', 950),
  ('a0000000-0000-0000-0000-000000000001', 4, 'RS Columbia Asia', '06:12', 190),
  ('a0000000-0000-0000-0000-000000000001', 5, 'Selecta', '06:14', 110),
  ('a0000000-0000-0000-0000-000000000001', 6, 'Danau Toba', '06:19', 400),
  ('a0000000-0000-0000-0000-000000000001', 7, 'LePolonia', '06:23', 950),
  ('a0000000-0000-0000-0000-000000000001', 8, 'Istana Maimun', '06:31', 2000),
  ('a0000000-0000-0000-0000-000000000001', 9, 'Mesjid Raya', '06:34', 450),
  ('a0000000-0000-0000-0000-000000000001', 10, 'Grand Antarez', '06:46', 4100),
  ('a0000000-0000-0000-0000-000000000001', 11, 'Antares', '06:53', 2100),
  ('a0000000-0000-0000-0000-000000000001', 12, 'Simp Marendal Aroma', '07:16', 7100),
  ('a0000000-0000-0000-0000-000000000001', 13, 'RM Khas Mandailing', '07:26', 3400),
  ('a0000000-0000-0000-0000-000000000001', 14, 'Simpang Amplas', '07:39', 4800),
  ('a0000000-0000-0000-0000-000000000001', 15, 'KNO', '08:14', 31000);

-- Seed Rayon B pickup points
INSERT INTO public.shuttle_pickup_points (route_id, sequence, name, pickup_time, distance_m) VALUES
  ('b0000000-0000-0000-0000-000000000001', 1, 'Cambridge', '06:00', 0),
  ('b0000000-0000-0000-0000-000000000001', 2, 'Swiss Bellin Gajah', '06:05', 1400),
  ('b0000000-0000-0000-0000-000000000001', 3, 'Grand Darussalam', '06:08', 750),
  ('b0000000-0000-0000-0000-000000000001', 4, 'Sulthan Hotel', '06:10', 160),
  ('b0000000-0000-0000-0000-000000000001', 5, 'Grand Kanaya', '06:12', 160),
  ('b0000000-0000-0000-0000-000000000001', 6, 'Four Point', '06:15', 450),
  ('b0000000-0000-0000-0000-000000000001', 7, 'Manhattan', '06:25', 3600),
  ('b0000000-0000-0000-0000-000000000001', 8, 'Saka Hotel', '06:29', 750),
  ('b0000000-0000-0000-0000-000000000001', 9, 'Grand Jamee', '06:33', 950),
  ('b0000000-0000-0000-0000-000000000001', 10, 'Sky View Apart', '06:47', 5200),
  ('b0000000-0000-0000-0000-000000000001', 11, 'The K-Hotel', '06:58', 3700),
  ('b0000000-0000-0000-0000-000000000001', 12, 'Simpang Pos', '07:04', 2000),
  ('b0000000-0000-0000-0000-000000000001', 13, 'Asrama Haji Medan', '07:11', 2800),
  ('b0000000-0000-0000-0000-000000000001', 14, 'RS Mitra Sejati', '07:16', 1600),
  ('b0000000-0000-0000-0000-000000000001', 15, 'Simpang Marendal', '07:28', 4400),
  ('b0000000-0000-0000-0000-000000000001', 16, 'Depan Bus ALS', '07:39', 3600),
  ('b0000000-0000-0000-0000-000000000001', 17, 'RS Mitra Medika Amplas', '07:48', 2800),
  ('b0000000-0000-0000-0000-000000000001', 18, 'Tol/Simpang Amplas', '07:52', 1200),
  ('b0000000-0000-0000-0000-000000000001', 19, 'KNO', '08:25', 30000);

-- Seed Rayon C pickup points
INSERT INTO public.shuttle_pickup_points (route_id, sequence, name, pickup_time, distance_m) VALUES
  ('c0000000-0000-0000-0000-000000000001', 1, 'Adi Mulia', '06:00', 0),
  ('c0000000-0000-0000-0000-000000000001', 2, 'Santika', '06:03', 450),
  ('c0000000-0000-0000-0000-000000000001', 3, 'Arya Duta', '06:05', 240),
  ('c0000000-0000-0000-0000-000000000001', 4, 'Aston Grand City Hall', '06:08', 230),
  ('c0000000-0000-0000-0000-000000000001', 5, 'Grand Inna', '06:10', 130),
  ('c0000000-0000-0000-0000-000000000001', 6, 'Reiz Suite Artotel', '06:13', 450),
  ('c0000000-0000-0000-0000-000000000001', 7, 'Podomoro', '06:18', 700),
  ('c0000000-0000-0000-0000-000000000001', 8, 'JW Marriot', '06:23', 750),
  ('c0000000-0000-0000-0000-000000000001', 9, 'Emerald Garden', '06:28', 750),
  ('c0000000-0000-0000-0000-000000000001', 10, 'Grand Mercure', '06:38', 1600),
  ('c0000000-0000-0000-0000-000000000001', 11, 'RS Columbia Asia Aksara', '06:50', 4800),
  ('c0000000-0000-0000-0000-000000000001', 12, 'Tol Bandar Selamat', '06:55', 1300),
  ('c0000000-0000-0000-0000-000000000001', 13, 'Tol KNO', '07:30', 20000);

-- Seed Rayon D pickup points
INSERT INTO public.shuttle_pickup_points (route_id, sequence, name, pickup_time, distance_m) VALUES
  ('d0000000-0000-0000-0000-000000000001', 1, 'Hotel TD Pardede', '06:00', 0),
  ('d0000000-0000-0000-0000-000000000001', 2, 'Hermes Palace', '06:10', 2400),
  ('d0000000-0000-0000-0000-000000000001', 3, 'Ibis Styles', '06:21', 3500),
  ('d0000000-0000-0000-0000-000000000001', 4, 'Fave Hotel', '06:24', 850),
  ('d0000000-0000-0000-0000-000000000001', 5, 'Masjid Al Jihad', '06:29', 1300),
  ('d0000000-0000-0000-0000-000000000001', 6, 'Hotel Deli', '06:31', 550),
  ('d0000000-0000-0000-0000-000000000001', 7, 'Grand Central', '06:33', 350),
  ('d0000000-0000-0000-0000-000000000001', 8, 'Grand Impression Hotel', '06:38', 1600),
  ('d0000000-0000-0000-0000-000000000001', 9, 'RAZ Hotel', '06:40', 550),
  ('d0000000-0000-0000-0000-000000000001', 10, 'Rumah Sakit USU', '06:45', 1600),
  ('d0000000-0000-0000-0000-000000000001', 11, 'Grand Dhika Hotel', '07:01', 2000),
  ('d0000000-0000-0000-0000-000000000001', 12, 'Sky View Apart', '07:09', 2400),
  ('d0000000-0000-0000-0000-000000000001', 13, 'Simpang Harmonika', '07:15', 1800),
  ('d0000000-0000-0000-0000-000000000001', 14, 'Citra Garden', '07:23', 3700),
  ('d0000000-0000-0000-0000-000000000001', 15, 'Simpang POS', '07:32', 2700),
  ('d0000000-0000-0000-0000-000000000001', 16, 'Asrama Haji', '07:39', 2800),
  ('d0000000-0000-0000-0000-000000000001', 17, 'Simpang Amplas', '07:55', 5900),
  ('d0000000-0000-0000-0000-000000000001', 18, 'Kualanamu', '08:32', 30000);

-- Seed vehicle classes
INSERT INTO public.shuttle_vehicle_classes (name, price_per_km, baggage_rules, seating_layouts, sort_order) VALUES
  ('Reguler', 1900, '["Tas tangan", "Bawaan max 8kg", "Koper non bagasi (max 20 inch)", "Non koper"]'::jsonb,
   '{"SUV": {"rows": [[1, "driver"], [2,3,4], [5,6,7]], "total_seats": 7}, "Minicar": {"rows": [[1], [2,3,4]], "total_seats": 4}, "Hiace": {"rows": [[1], [2,3], [4,5], [6,7,8,9,10], ["bagasi"]], "total_seats": 10}}'::jsonb, 1),
  ('Semi Executive', 2200, '["Koper 20\"", "Tas tangan"]'::jsonb,
   '{"SUV": {"rows": [[1, "driver"], [2,3,4], ["bagasi"]], "total_seats": 4}, "Minicar": {"rows": [[1], [2,3,"bagasi"]], "total_seats": 3}}'::jsonb, 2),
  ('Executive', 2500, '["Koper 24\"", "Tas tangan", "Tas laptop"]'::jsonb,
   '{"SUV": {"rows": [[1, "driver"], [2,3], ["bagasi"]], "total_seats": 3}, "Minicar": {"rows": [[1], [2,3], ["bagasi"]], "total_seats": 3}}'::jsonb, 3);

-- Seed departures (rotating A/B/C/D batches)
INSERT INTO public.shuttle_departures (batch_label, departure_time, arrival_time, route_id) VALUES
  ('Batch 1', '06:00', '07:30', 'a0000000-0000-0000-0000-000000000001'),
  ('Batch 1', '06:00', '08:25', 'b0000000-0000-0000-0000-000000000001'),
  ('Batch 1', '06:00', '07:30', 'c0000000-0000-0000-0000-000000000001'),
  ('Batch 1', '06:00', '08:32', 'd0000000-0000-0000-0000-000000000001'),
  ('Batch 2', '07:00', '08:30', 'a0000000-0000-0000-0000-000000000001'),
  ('Batch 2', '07:00', '09:25', 'b0000000-0000-0000-0000-000000000001'),
  ('Batch 2', '07:00', '08:30', 'c0000000-0000-0000-0000-000000000001'),
  ('Batch 2', '07:00', '09:32', 'd0000000-0000-0000-0000-000000000001'),
  ('Batch 3', '08:00', '09:30', 'a0000000-0000-0000-0000-000000000001'),
  ('Batch 3', '08:00', '10:25', 'b0000000-0000-0000-0000-000000000001'),
  ('Batch 3', '08:00', '09:30', 'c0000000-0000-0000-0000-000000000001'),
  ('Batch 3', '08:00', '10:32', 'd0000000-0000-0000-0000-000000000001'),
  ('Batch 4', '09:00', '10:30', 'a0000000-0000-0000-0000-000000000001'),
  ('Batch 4', '09:00', '11:25', 'b0000000-0000-0000-0000-000000000001'),
  ('Batch 4', '09:00', '10:30', 'c0000000-0000-0000-0000-000000000001'),
  ('Batch 4', '09:00', '11:32', 'd0000000-0000-0000-0000-000000000001');
