

## Plan: Driver ETA & Reverse Geocoding

### What Changes

1. **Reverse geocoding hook** — new `useReverseGeocoding` hook that converts lat/lng to a readable address via Nominatim's `/reverse` endpoint
2. **Driver ETA calculation** — compute nearest driver distance from pickup, show dynamic ETA per vehicle type instead of static "3 min" / "5 min"
3. **Readable addresses on map tap** — when user taps the map or uses "My Location", reverse geocode the coordinates to show a street name instead of raw `"-6.2088, 106.8456"`

### Implementation

**New: `src/hooks/use-reverse-geocoding.ts`**
- Accept `latlng: [number, number] | null`
- Debounce 500ms, call Nominatim `/reverse?lat=...&lon=...&format=json`
- Return `{ name, address, loading }`
- Abort previous request on new coordinates

**Modify: `src/pages/RideBooking.tsx`**
- Import `useReverseGeocoding`
- Call it twice: once for pickup coords, once for destination coords
- When reverse geocode resolves, update `pickupName` / `destName` with the readable address (only when the name is currently raw coordinates)
- Compute `nearestDriverKm` from `nearbyDriverPositions` using `haversineDistance` to pickup
- Replace static `eta` in `VEHICLE_CONFIG` with dynamic calculation: `Math.max(1, Math.ceil(nearestDriverKm * 3))` min for bike, `* 4` for car, `* 5` for premium
- Show the dynamic ETA in the vehicle selection cards

### Files

| Action | File |
|--------|------|
| Create | `src/hooks/use-reverse-geocoding.ts` |
| Modify | `src/pages/RideBooking.tsx` |

