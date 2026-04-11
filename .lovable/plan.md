

## Plan: Sistem Manajemen Shuttle Komprehensif

Berdasarkan gambar yang diunggah, ini adalah layanan shuttle **Medan → Kualanamu Airport** dengan sistem rayon, kelas kendaraan, dan titik jemput bertingkat.

### Apa yang Dibangun

**1. Database Tables Baru (4 tabel)**

- **shuttle_routes** — Rayon/rute utama (Rayon A, B, C, D) dengan kota asal, tujuan, total jarak
- **shuttle_pickup_points** — Titik jemput per rayon dengan urutan, nama lokasi, waktu jemput (WIB), dan tarif (Mtr)
- **shuttle_vehicle_classes** — 3 kelas kendaraan (Reguler, Semi Executive, Executive) dengan harga/km, ketentuan bagasi, dan layout kursi per tipe kendaraan (SUV, Minicar, Hiace)
- **shuttle_departures** — Jadwal keberangkatan batch (A 06:00, B 07:00, C 08:00, dst.) dengan rayon assignment dan driver count

**2. Seed Data dari Gambar**

Rayon A (17 titik jemput: Hermes Palace → KNO), Rayon B (18 titik: Cambridge → KNO), Rayon C (12 titik: Adi Mulia → Tol KNO), Rayon D (17 titik: Hotel TD Pardede → Kualanamu). Kelas kendaraan: Reguler (Rp 1.900/km), Semi Executive (Rp 2.200/km), Executive (Rp 2.500/km) dengan seating layout per tipe (SUV/Minicar/Hiace).

**3. Admin Shuttle Page Overhaul (`AdminShuttle.tsx`)**

Tabs baru:
- **Rayon & Rute** — Tabel rayon dengan expand untuk melihat/edit titik jemput, waktu, dan tarif. CRUD untuk menambah/hapus titik jemput.
- **Kelas Kendaraan** — Tabel kelas dengan harga/km, aturan bagasi, dan visual seating layout (SUV: 1+driver/2+3 rows, Minicar: 1+2+3, Hiace: 1+2+2+5+bagasi). Edit harga dan ketentuan.
- **Jadwal Keberangkatan** — Batch schedule per hari (A/B/C rotasi rayon) dengan assignment driver. Manage departure times.
- **Booking** — Existing booking table (tetap)

**4. Data Hooks**

Tambah hooks di `use-admin-data.ts`: `useShuttleRoutes`, `useShuttlePickupPoints`, `useShuttleVehicleClasses`, `useShuttleDepartures` dengan mutation hooks untuk CRUD.

**5. Update Shuttle Booking Page (User-facing)**

Update `Shuttle.tsx` untuk menggunakan data rayon & titik jemput dari database (bukan hardcoded cities). User memilih rayon → titik jemput → kelas kendaraan → kursi → bayar.

### Files

| Action | File |
|--------|------|
| Create | Migration: 4 tabel baru + seed data |
| Modify | `src/hooks/use-admin-data.ts` — tambah hooks baru |
| Rewrite | `src/pages/admin/AdminShuttle.tsx` — UI komprehensif |
| Modify | `src/pages/Shuttle.tsx` — gunakan data dari database |

### Technical Notes
- Seating layout disimpan sebagai JSON array di `shuttle_vehicle_classes` (rows × cols per vehicle type)
- Tarif di pickup_points dalam satuan meter (sesuai gambar "FAR (Mtr)"), akan dikonversi ke rupiah berdasarkan harga/km kelas kendaraan
- RLS permissive (admin-guarded via sessionStorage)
- Existing `shuttle_schedules` dan `shuttle_bookings` tables tetap dipertahankan untuk backward compatibility

