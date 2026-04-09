# Realtime Layer API Documentation

This document describes the implementation of the realtime layer for the Transportation Management System using Supabase Realtime and Edge Functions.

## 1. Realtime Driver Tracking

### Channel: `driver_locations:{driver_id}`
Broadcasts GPS coordinates every 5 seconds.

**Usage (Client SDK):**
```typescript
realtimeService.subscribeToDriverLocation('DRV-123', (location) => {
  console.log('Driver position:', location.lat, location.lng);
});
```

**Throttling:**
- Server-side throttling: Maximum 12 updates per minute per driver.
- Excessive updates return HTTP 429 via `update-location` Edge Function.

## 2. Trip Status Notifications

### Channel: `trip_updates:{trip_id}`
Broadcasts instantaneous status transitions.

**Statuses:**
- `pending`: Request created.
- `accepted`: Driver assigned.
- `in-progress`: Trip started.
- `completed`: Trip finished.
- `cancelled`: Trip aborted.

**Acknowledgment:**
All updates must be acknowledged within 3 seconds. The SDK automatically calls the `trip-acknowledgment` Edge Function upon receiving an update.

## 3. Dynamic Dispatch System

### Event: `new_request`
Broadcasted to online drivers within a 5km radius.

**Process:**
1. Passenger creates trip via Edge Function `dispatch-ride`.
2. Algorithm searches online drivers using PostGIS `st_dwithin`.
3. Dispatch events inserted into `dispatch_events` table (replicated via Realtime).
4. Drivers receive notification and have 15 seconds to respond.

## 4. Presence & Heartbeat

- **Driver Heartbeat:** SDK sends heartbeat every 30 seconds to update `last_heartbeat`.
- **Cleanup:** PostgreSQL function `cleanup_offline_drivers` marks drivers as offline after 60 seconds of inactivity.

## 5. Reliability & Fallback

- **Exponential Backoff:** Reconnection starts at 1s, doubling up to 30s.
- **Persistence:** Connection state stored in `localStorage` to handle browser refreshes.
- **Polling Fallback:** If WebSocket fails, use `realtimeService.pollTripStatus(tripId)` for manual updates.

## 6. Security

- **RLS Policies:** Ensures passengers only see their trips and drivers only see assigned rides.
- **Rate Limiting:** Client-side and server-side rate limiting (100 msg/min).
- **Service Role:** Edge Functions use service role keys for privileged operations (e.g., dispatching).
