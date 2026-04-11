

## Plan: Connect Admin Dashboard to Lovable Cloud Database

### Summary
Replace all mock data in the admin dashboard with persistent Supabase tables. This involves creating database tables, seeding initial data, setting up the Supabase client, and updating all admin pages to fetch/mutate real data.

### Step 1: Enable Lovable Cloud & Create Database Tables

Create 6 tables matching the current mock data structure:

- **users** — id, name, email, phone, role (passenger/driver/admin), status (active/suspended), total_trips, created_at
- **drivers** — id, name, email, phone, vehicle_class, vehicle_plate, vehicle_model, status (online/offline/busy), rating, total_trips, approved, joined_at
- **trips** — id, passenger_name, driver_name, pickup, dropoff, vehicle_class, status, fare, distance, created_at
- **shuttle_schedules** — id, from_city, to_city, departure, arrival, duration, price, operator, total_seats, available_seats
- **shuttle_bookings** — id, passenger_name, route, departure, seats, total_price, status, created_at
- **transactions** — id, description, amount, method, status, related_to, created_at
- **promos** — id, title, subtitle, gradient, badge, active, start_date, end_date

All tables will have RLS disabled initially (admin-only access pattern with sessionStorage guard).

### Step 2: Seed Initial Data
Insert the current mock data as seed records so the dashboard isn't empty on first load.

### Step 3: Set Up Supabase Client
Create `src/integrations/supabase/client.ts` with the auto-generated Supabase URL and anon key from Lovable Cloud.

### Step 4: Create Data Hooks
Create `src/hooks/use-admin-data.ts` with React Query hooks for each entity:
- `useAdminUsers()`, `useAdminDrivers()`, `useAdminTrips()`, etc.
- Each hook returns `{ data, isLoading, error, refetch }`
- Mutation hooks for status updates: `useUpdateUserStatus()`, `useUpdateDriverApproval()`, etc.

### Step 5: Update Admin Pages
Replace mock data imports with real data hooks in all 7 admin pages:

| Page | Changes |
|------|---------|
| `AdminDashboard.tsx` | Fetch KPIs from aggregated queries, charts from trips/transactions |
| `AdminUsers.tsx` | Query users table, real suspend/activate mutations |
| `AdminDrivers.tsx` | Query drivers table, real approve/suspend mutations |
| `AdminTrips.tsx` | Query trips table with status filters |
| `AdminShuttle.tsx` | Query shuttle_schedules + shuttle_bookings |
| `AdminPayments.tsx` | Query transactions, compute revenue stats |
| `AdminPromos.tsx` | Full CRUD on promos table |

### Step 6: Add Loading & Error States
Add skeleton loaders and error alerts to all admin pages for better UX during data fetching.

### Files

| Action | File |
|--------|------|
| Create | Database migrations for 7 tables + seed data |
| Create | `src/integrations/supabase/client.ts` |
| Create | `src/integrations/supabase/types.ts` |
| Create | `src/hooks/use-admin-data.ts` |
| Modify | `src/pages/admin/AdminDashboard.tsx` |
| Modify | `src/pages/admin/AdminUsers.tsx` |
| Modify | `src/pages/admin/AdminDrivers.tsx` |
| Modify | `src/pages/admin/AdminTrips.tsx` |
| Modify | `src/pages/admin/AdminShuttle.tsx` |
| Modify | `src/pages/admin/AdminPayments.tsx` |
| Modify | `src/pages/admin/AdminPromos.tsx` |

### Technical Notes
- Lovable Cloud must be enabled first (it auto-provisions Supabase)
- RLS will be kept simple since admin access is already guarded by sessionStorage auth
- React Query provides caching, background refetch, and optimistic updates
- Mock data file (`mock-admin-data.ts`) will be kept as fallback reference but no longer imported by admin pages

