

## Plan: Enhanced Realtime — Nearest Driver Matching & Live Tracking

### Summary

The realtime infrastructure (BroadcastChannel event bus, driver location streaming, trip status pub/sub) already exists. This plan adds the missing pieces: a **nearest-driver matching algorithm**, **passenger-side live driver tracking on the map during search**, **dispatch integration from RideBooking through to driver acceptance**, and **improved driver movement simulation** with realistic road-following behavior.

### What Will Be Built

**1. Create `src/lib/dispatch.ts` — Matching Algorithm & Dispatch Engine**
- `findNearestDriver(pickupCoords, availableDrivers[])` — Haversine distance calculation, returns sorted list by proximity
- `DispatchEngine` class that manages a pool of simulated available drivers (5-8 drivers with random positions near Jakarta center)
- When a ride is requested: finds nearest driver, publishes `dispatch:request`, waits for response with timeout (15s), falls back to next-nearest driver
- Exposes `requestRide(pickup, dropoff, fare, passengerName)` which returns a Promise resolving to the matched driver or rejection

**2. Modify `src/context/RideContext.tsx` — Integrate Dispatch**
- Add `requestRide()` function that calls the dispatch engine
- Store matched driver info (name, vehicle, plate, rating, position) in ride state
- On `dispatch:response` acceptance: set status to `found`, populate driver details
- On timeout/rejection: set status to `timeout`

**3. Modify `src/pages/RideTracking.tsx` — Live Driver Tracking**
- Remove hardcoded `DRIVER` constant — use matched driver from RideContext
- Subscribe to `driver:location` filtered by matched `driverId` for continuous map updates
- Show real driver position on map during `searching` phase (nearest drivers) and `arriving`/`on_trip` phases (matched driver)
- Replace timer-based status transitions with realtime event-driven transitions (keep timers as fallback for single-tab demo)

**4. Modify `src/context/DriverContext.tsx` — Improved Simulation**
- Add simulated driver pool: 5-8 drivers with names, vehicles, ratings, and starting positions
- When ride request arrives via dispatch, auto-accept after 2-3s random delay (simulating driver response time)
- Improved movement simulation: follow generated route points instead of random drift
- Publish driver pool positions periodically so passenger tab can show nearby drivers in real-time

**5. Modify `src/pages/RideBooking.tsx` — Live Nearby Drivers**
- Replace static random `nearbyDrivers` with realtime positions from `driver:location` channel
- Show actual simulated driver positions updating on the map in real-time
- When user confirms booking, trigger dispatch through RideContext instead of directly navigating

**6. Modify `src/components/MapView.tsx` — Multiple Streaming Drivers**
- Add `streamingDrivers` prop (array of `{ id, coords, heading }`) for showing multiple live driver markers
- Smooth interpolation for all streaming markers, not just one
- Add driver heading rotation to car icon

**7. Modify `src/pages/driver/DriverTrip.tsx` — Smoother Simulation**
- Use finer-grained route points (80 steps instead of 40)
- Add speed variation based on simulated road conditions
- Broadcast at 2s intervals for low-latency tracking

### Matching Algorithm

```text
function findNearestDriver(pickup: LatLng, drivers: SimDriver[]): SimDriver | null {
  // 1. Filter drivers with status === "online" and tripStatus === "idle"
  // 2. Calculate Haversine distance from pickup to each driver
  // 3. Sort by distance ascending
  // 4. Return closest driver within 5km radius, or null
}

Haversine formula:
  a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlng/2)
  d = 2R × atan2(√a, √(1-a))   where R = 6371 km
```

### Enhanced Flow

```text
Passenger books ride
  → RideContext.requestRide()
  → DispatchEngine.findNearestDriver(pickup, driverPool)
  → Publishes dispatch:request to matched driver
  → Driver tab receives request (or auto-accept in single-tab mode)
  → dispatch:response published back
  → RideContext updates with matched driver info
  → RideTracking shows real driver moving on map
  → Trip status updates flow via realtime channels
```

### Files

| Action | File |
|--------|------|
| Create | `src/lib/dispatch.ts` |
| Modify | `src/context/RideContext.tsx` |
| Modify | `src/context/DriverContext.tsx` |
| Modify | `src/pages/RideTracking.tsx` |
| Modify | `src/pages/RideBooking.tsx` |
| Modify | `src/components/MapView.tsx` |
| Modify | `src/pages/driver/DriverTrip.tsx` |
| Modify | `src/hooks/use-realtime.ts` — add `useNearbyDrivers()` hook |

### Technical Details

- **Haversine distance** used for matching — accurate for short distances without projection overhead
- **Driver pool simulation** runs in the passenger tab when no driver tab is open, ensuring the demo works in single-tab mode
- **Fallback timers** preserved so the flow works even without cross-tab communication
- **Latency optimization**: location broadcasts at 2s intervals, marker interpolation at 60fps via `requestAnimationFrame`
- **Scalability pattern**: the dispatch engine interface accepts a driver array, making it trivial to swap from in-memory pool to a database query

