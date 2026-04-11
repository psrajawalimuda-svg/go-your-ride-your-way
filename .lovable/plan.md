

## Plan: Comprehensive Admin Dashboard

### Summary
Build a full admin dashboard at `/admin/*` with sidebar navigation, mock data, and management pages for all application entities: users, drivers, trips, shuttle bookings, payments, and promo banners. All data is demo/mock (no backend required).

### Pages & Features

**1. Admin Login (`/admin/login`)**
- Simple hardcoded admin login (email: admin@pyugo.com, password: admin123)
- Stores admin session in state, redirects to `/admin`

**2. Admin Layout (`AdminLayout.tsx`)**
- Sidebar with navigation: Dashboard, Users, Drivers, Trips, Shuttle, Payments, Promos, Settings
- Top bar with admin name, logout button
- Responsive: collapsible sidebar on mobile

**3. Dashboard Overview (`/admin`)**
- KPI cards: Total Users, Active Drivers, Today's Trips, Revenue, Pending Payments
- Mini charts (using recharts already in deps): trips over 7 days, revenue trend
- Recent activity feed

**4. User Management (`/admin/users`)**
- Table listing mock users with search/filter
- Status badges, role display
- View detail / suspend actions (mock)

**5. Driver Management (`/admin/drivers`)**
- Table: name, vehicle, status (online/offline/busy), rating, total trips
- Approve/suspend toggle
- Vehicle details expandable row

**6. Trip Management (`/admin/trips`)**
- Table: trip ID, passenger, driver, pickup, dropoff, status, fare, date
- Filter by status (completed, cancelled, on_trip)
- Trip detail modal

**7. Shuttle Management (`/admin/shuttle`)**
- Schedule management: list routes, edit departure times/prices
- Booking list with status filters

**8. Payment/Transaction Management (`/admin/payments`)**
- Transaction table: ID, amount, method, status, date
- Summary stats: total revenue, by payment method breakdown

**9. Promo Management (`/admin/promos`)**
- List current promo banners (from home carousel data)
- Add/edit/delete promo (mock CRUD)

### Files

| Action | File |
|--------|------|
| Create | `src/pages/admin/AdminLogin.tsx` |
| Create | `src/pages/admin/AdminDashboard.tsx` |
| Create | `src/pages/admin/AdminUsers.tsx` |
| Create | `src/pages/admin/AdminDrivers.tsx` |
| Create | `src/pages/admin/AdminTrips.tsx` |
| Create | `src/pages/admin/AdminShuttle.tsx` |
| Create | `src/pages/admin/AdminPayments.tsx` |
| Create | `src/pages/admin/AdminPromos.tsx` |
| Create | `src/components/admin/AdminLayout.tsx` |
| Create | `src/components/admin/AdminSidebar.tsx` |
| Create | `src/lib/mock-admin-data.ts` — centralized mock data for all admin tables |
| Modify | `src/App.tsx` — add admin routes |

### Technical Notes
- Uses existing UI components (Table, Card, Badge, Button, Input, Tabs, Sheet)
- Recharts for dashboard charts (already a project dependency)
- Mock data generated in a single file for consistency across pages
- Admin auth is local state only (no real auth) with a simple guard component
- Sidebar uses the existing Sidebar component from shadcn/ui

