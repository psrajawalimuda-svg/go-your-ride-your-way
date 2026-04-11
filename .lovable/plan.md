

## Plan: Fix Leaflet Bug & Add Dynamic Price/Distance Calculation

### Summary
The ride booking flow is already fully built (location picking, vehicle selection, confirmation, trip lifecycle with live tracking). This plan fixes the runtime crash and adds dynamic distance-based pricing to replace hardcoded values.

### Changes

**1. Fix Leaflet crash in `src/components/MapView.tsx`**
- The `_leaflet_pos` error occurs when the geolocation callback fires after the map component unmounts
- Add a guard: check `mapInstanceRef.current` is still valid before calling `setView` or `setLatLng` in the geolocation callback
- Same fix for the `locateUser` callback

**2. Add dynamic distance/price calculation in `src/pages/RideBooking.tsx`**
- Import `haversineDistance` from `src/lib/dispatch.ts`
- Calculate real distance between pickup and destination using Haversine
- Estimate duration based on average speed (~20 km/h city driving)
- Compute dynamic fares per vehicle type using base fare + per-km rate:
  - Bike: Rp 2,000 base + Rp 1,500/km
  - Car: Rp 5,000 base + Rp 4,000/km  
  - Premium: Rp 10,000 base + Rp 7,000/km
  - Women Bike: Rp 3,000 base + Rp 2,000/km
- Replace hardcoded "~5.2 km / ~15 min" in the fare step with calculated values
- Update vehicle price display with computed fares
- Pass the calculated fare to `setRide` on booking

### Files

| Action | File |
|--------|------|
| Modify | `src/components/MapView.tsx` — guard geolocation callbacks |
| Modify | `src/pages/RideBooking.tsx` — dynamic distance & pricing |

