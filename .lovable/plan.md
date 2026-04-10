

## Plan: Realtime Layer

### Context

This is a client-side React app without a backend server. Firebase or Socket.IO would require external infrastructure. Since the project already uses simulated data flows (timers in DriverContext, RideTracking), the best approach is to build a **realtime simulation layer** using an event-driven architecture that mirrors how a real WebSocket/Firebase connection would work — making it trivial to swap in a real transport later.

### Architecture

```text
src/lib/realtime.ts        — RealtimeService class (event bus + simulated transport)
src/hooks/use-realtime.ts  — React hooks for subscribing to channels
```

The `RealtimeService` acts as a singleton event emitter with channel-based pub/sub. In demo mode it uses `BroadcastChannel` (cross-tab communication) + internal event dispatch. When a real backend is added, only the transport layer changes — all hooks and consumers stay the same.

### What Will Be Built

**1. `src/lib/realtime.ts` — RealtimeService**
- Singleton event bus with `subscribe(channel, callback)`, `publish(channel, data)`, `unsubscribe()`
- Channels: `driver:location`, `trip:status`, `dispatch:request`, `dispatch:response`
- Auto-reconnect logic (simulated with exponential backoff pattern)
- Connection state: `connecting`, `connected`, `disconnected`, `reconnecting`
- `BroadcastChannel` for cross-tab sync (passenger tab ↔ driver tab)
- Configurable transport adapter interface for future Firebase/WebSocket swap

**2. `src/hooks/use-realtime.ts` — React Hooks**
- `useRealtimeChannel<T>(channel)` — subscribe to a channel, returns latest message
- `useDriverTracking(driverId)` — returns live `LatLng`, auto-updates every 3s
- `useTripStatus(tripId)` — returns live `TripStatus` updates
- `useConnectionStatus()` — returns connection state for UI indicators
- All hooks auto-cleanup on unmount

**3. Modify `src/context/DriverContext.tsx`**
- Publish `driver:location` every 3-5s when online (simulated position drift)
- Publish `trip:status` on every status change
- Publish `dispatch:request` when a ride request is created
- Listen for `dispatch:response` (accept/reject from driver tab)

**4. Modify `src/pages/RideTracking.tsx`**
- Subscribe to `driver:location` for live driver position on map
- Subscribe to `trip:status` for real-time status updates
- Replace hardcoded timer-based status transitions with realtime events

**5. Modify `src/pages/driver/DriverHome.tsx`**
- Subscribe to `dispatch:request` to receive ride requests from passenger flow
- Show connection status indicator

**6. Modify `src/pages/driver/DriverTrip.tsx`**
- Publish location updates during active trip
- Publish trip status changes via realtime

**7. Modify `src/components/MapView.tsx`**
- Add support for streaming driver position updates (smooth interpolation between points)

### Channel Schema

| Channel | Direction | Payload |
|---------|-----------|---------|
| `driver:location` | Driver → Passenger | `{ driverId, coords: [lat, lng], heading, speed, timestamp }` |
| `trip:status` | Driver → Passenger | `{ tripId, status, timestamp }` |
| `dispatch:request` | System → Driver | `{ requestId, pickup, dropoff, fare, passenger }` |
| `dispatch:response` | Driver → System | `{ requestId, accepted, driverId }` |

### Cross-Tab Demo Flow

Open two browser tabs — one at `/home` (passenger), one at `/driver/home` (driver). When passenger books a ride, the driver tab receives the request via `BroadcastChannel`. When driver accepts and moves through the trip, the passenger tab sees live location and status updates.

### Files

| Action | File |
|--------|------|
| Create | `src/lib/realtime.ts` |
| Create | `src/hooks/use-realtime.ts` |
| Modify | `src/context/DriverContext.tsx` |
| Modify | `src/pages/RideTracking.tsx` |
| Modify | `src/pages/driver/DriverHome.tsx` |
| Modify | `src/pages/driver/DriverTrip.tsx` |
| Modify | `src/components/MapView.tsx` |

### Future Upgrade Path

The transport adapter interface means swapping to a real backend requires only changing the transport in `realtime.ts`:
- **Supabase Realtime**: Replace `BroadcastChannel` with `supabase.channel().on()`
- **Firebase**: Replace with `onValue()` / `onSnapshot()`
- **Socket.IO**: Replace with `socket.on()` / `socket.emit()`

No consumer code changes needed.

