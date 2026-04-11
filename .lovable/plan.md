

## Plan: Hubungkan Seluruh Hardcode ke Database

### Ringkasan
Menghapus semua data hardcoded/mock dari seluruh halaman dan context, menggantinya dengan data dari database Lovable Cloud. Ini mencakup halaman user-facing (Index, Shuttle, Activity, Wallet, Profile, RideBooking), driver context, dan sisa mock data di admin dashboard.

### Inventaris Hardcode yang Ditemukan

| File | Data Hardcoded |
|------|---------------|
| `AdminDashboard.tsx` | `tripsChartData`, `revenueChartData`, `recentActivity` dari mock file |
| `Index.tsx` | `promoSlides`, `vehicleTypes`, `recentPlaces`, `serviceOptions` |
| `Shuttle.tsx` | `CITIES`, `ALL_SCHEDULES` (12 jadwal hardcoded) |
| `Activity.tsx` | `trips` array (5 trip hardcoded) |
| `Wallet.tsx` | `mockTransactions`, hardcoded balance `180,000` |
| `RideBooking.tsx` | `VEHICLE_CONFIG` (baseFare, perKm per kelas), `defaultSuggestions` |
| `Profile.tsx` | Stats hardcoded ("24 rides", "8 shuttles", "4.9 rating") |
| `AuthContext.tsx` | `MOCK_USER` — user login palsu |
| `DriverContext.tsx` | `MOCK_REQUESTS`, earnings, `tripHistory` hardcoded |
| `PaymentContext.tsx` | Semua transaksi in-memory, balance hardcoded |
| `dispatch.ts` | `DRIVER_TEMPLATES`, `JAKARTA_CENTER` |

### Langkah Implementasi

**Step 1: Database Migration — Tabel Baru & Modifikasi**

Tabel baru yang diperlukan:
- **`user_profiles`** — profil user lengkap (menggantikan MOCK_USER), linked ke auth.users
- **`wallet_accounts`** — saldo wallet per user
- **`wallet_transactions`** — riwayat top-up dan pembayaran wallet
- **`saved_places`** — tempat tersimpan/recent per user
- **`ride_fare_config`** — konfigurasi tarif per kelas kendaraan (baseFare, perKm, etaMultiplier)

Tabel yang sudah ada dan akan dimanfaatkan:
- `promos` → untuk promo carousel di Index
- `trips` → untuk Activity page
- `transactions` → untuk Wallet page
- `drivers` → untuk dispatch engine
- `shuttle_routes` + `shuttle_pickup_points` + `shuttle_departures` → untuk Shuttle page
- `app_settings` → untuk konfigurasi zona/center city

**Step 2: Data Hooks Baru (`src/hooks/use-app-data.ts`)**

Hook baru untuk user-facing pages:
- `useActivePromos()` — fetch promos aktif untuk carousel
- `useShuttleSearch(from, to)` — fetch jadwal shuttle dari DB
- `useUserTrips(userId)` — fetch riwayat trip user
- `useUserWallet(userId)` — fetch saldo + riwayat wallet
- `useUserProfile(userId)` — fetch profil user
- `useSavedPlaces(userId)` — fetch tempat tersimpan
- `useRideFareConfig()` — fetch konfigurasi tarif kendaraan
- `useDriverPool()` — fetch driver online dari DB

**Step 3: Update Halaman User-Facing**

- **Index.tsx**: Promo carousel → `useActivePromos()`, vehicle types → `useRideFareConfig()`
- **Shuttle.tsx**: `CITIES` & `ALL_SCHEDULES` → `useShuttleSearch()` dari `shuttle_routes` + `shuttle_departures`
- **Activity.tsx**: Hardcoded trips → `useUserTrips()`
- **Wallet.tsx**: Mock transactions → `useUserWallet()`, balance dari `wallet_accounts`
- **RideBooking.tsx**: `VEHICLE_CONFIG` → `useRideFareConfig()` dari `ride_fare_config` atau `app_settings`
- **Profile.tsx**: Stats → computed dari `trips` + `shuttle_bookings` count

**Step 4: Update Context Files**

- **AuthContext.tsx**: Hubungkan ke Supabase Auth (email/phone login), profil dari `user_profiles`
- **PaymentContext.tsx**: Transaksi persist ke `transactions` table, wallet balance dari `wallet_accounts`
- **DriverContext.tsx**: Trip history dari `trips` table, earnings computed dari DB
- **ShuttleContext.tsx**: Booking persist ke `shuttle_bookings` table

**Step 5: Admin Dashboard — Hapus Sisa Mock**

- `tripsChartData` & `revenueChartData` → computed dari `trips` dan `transactions` table (aggregasi 7 hari terakhir)
- `recentActivity` → query gabungan dari `trips`, `transactions`, `drivers` yang terbaru
- Hapus file `src/lib/mock-admin-data.ts` sepenuhnya

### Files yang Diubah

| Action | File |
|--------|------|
| Create | Migration SQL (tabel baru + seed) |
| Create | `src/hooks/use-app-data.ts` — hooks user-facing |
| Modify | `src/pages/Index.tsx` — promo & vehicle dari DB |
| Modify | `src/pages/Shuttle.tsx` — jadwal dari DB |
| Modify | `src/pages/Activity.tsx` — trip history dari DB |
| Modify | `src/pages/Wallet.tsx` — wallet & transaksi dari DB |
| Modify | `src/pages/RideBooking.tsx` — fare config dari DB |
| Modify | `src/pages/Profile.tsx` — stats dari DB |
| Modify | `src/context/AuthContext.tsx` — Supabase Auth |
| Modify | `src/context/PaymentContext.tsx` — persist transaksi |
| Modify | `src/context/DriverContext.tsx` — trip history dari DB |
| Modify | `src/context/ShuttleContext.tsx` — persist booking |
| Modify | `src/pages/admin/AdminDashboard.tsx` — chart data dari DB |
| Delete | `src/lib/mock-admin-data.ts` |

### Catatan Teknis
- Auth menggunakan Supabase Auth dengan email signup + auto-confirm disabled
- Google Auth ditambahkan sebagai opsi login
- RLS policies pada tabel user-facing akan membatasi akses per user (`auth.uid()`)
- Dispatch engine tetap menggunakan simulated drivers sebagai fallback saat tidak ada driver real online
- Wallet balance dihitung dari `wallet_accounts` table, bukan hardcoded
- Chart data di dashboard dihitung secara real-time dari aggregasi query

