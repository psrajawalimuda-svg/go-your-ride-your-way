
-- Ride fare configuration table
CREATE TABLE public.ride_fare_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_type text NOT NULL UNIQUE,
  label text NOT NULL,
  base_fare integer NOT NULL DEFAULT 0,
  per_km_rate integer NOT NULL DEFAULT 0,
  eta_multiplier numeric NOT NULL DEFAULT 3,
  description text NOT NULL DEFAULT '',
  icon_type text NOT NULL DEFAULT 'car',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ride_fare_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read fare config"
  ON public.ride_fare_config FOR SELECT USING (true);

CREATE POLICY "Admin can manage fare config"
  ON public.ride_fare_config FOR ALL USING (true) WITH CHECK (true);

-- Seed fare config
INSERT INTO public.ride_fare_config (vehicle_type, label, base_fare, per_km_rate, eta_multiplier, description, icon_type, sort_order) VALUES
  ('bike', 'PYU Bike', 2000, 1500, 3, 'Affordable motorcycle ride', 'bike', 1),
  ('car', 'PYU Car', 5000, 4000, 4, 'Comfortable car ride', 'car', 2),
  ('premium', 'PYU Premium', 10000, 7000, 5, 'Luxury experience', 'car', 3),
  ('womenbike', 'PYU Women Bike', 3000, 2000, 3, 'Safe ride by female drivers', 'bike', 4);

-- Seed promos if empty
INSERT INTO public.promos (id, title, subtitle, gradient, badge, active, start_date, end_date)
SELECT * FROM (VALUES
  ('promo-1', 'Diskon 50% Ride Pertama', 'Khusus pengguna baru', 'from-emerald-500 to-teal-600', 'NEW USER', true, '2026-04-01', '2026-06-30'),
  ('promo-2', 'Cashback 20% Shuttle', 'Min. transaksi Rp 100.000', 'from-blue-500 to-indigo-600', 'CASHBACK', true, '2026-04-01', '2026-05-15'),
  ('promo-3', 'Gratis Ongkir Premium', 'Setiap hari Jumat', 'from-amber-500 to-orange-600', 'FRIDAY', true, '2026-03-15', '2026-06-30'),
  ('promo-4', 'Weekend Bonus 2x Points', 'Berlaku Sabtu & Minggu', 'from-pink-500 to-rose-600', 'WEEKEND', true, '2026-04-01', '2026-07-31')
) AS v(id, title, subtitle, gradient, badge, active, start_date, end_date)
WHERE NOT EXISTS (SELECT 1 FROM public.promos LIMIT 1);

-- Seed service zone center in app_settings
INSERT INTO public.app_settings (key, label, category, value, description)
VALUES ('service_zone_center', 'Pusat Zona Layanan', 'zone', '{"lat": -6.2088, "lng": 106.8456, "label": "Jakarta"}', 'Koordinat pusat zona layanan')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.app_settings (key, label, category, value, description)
VALUES ('default_suggestions', 'Saran Lokasi Default', 'ride', '[{"name":"Grand Indonesia Mall","addr":"Jl. MH Thamrin No. 1","lat":-6.195,"lng":106.822},{"name":"Monas","addr":"Gambir, Central Jakarta","lat":-6.1754,"lng":106.8272},{"name":"Blok M Plaza","addr":"Jl. Sultan Hasanuddin","lat":-6.2443,"lng":106.7981}]', 'Saran lokasi default untuk ride booking')
ON CONFLICT (key) DO NOTHING;
