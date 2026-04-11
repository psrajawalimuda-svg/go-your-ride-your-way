// ─── Dispatch Engine ─────────────────────────────────────────────────────────
// Nearest-driver matching with Haversine distance, simulated driver pool,
// and dispatch lifecycle with timeout/fallback.

import type { LatLng } from "@/types/models";
import { realtime } from "@/lib/realtime";

// ── Haversine Distance ──────────────────────────────────────────────────────

const R = 6371; // Earth radius in km

export function haversineDistance(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const x = sinDLat * sinDLat + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * sinDLng * sinDLng;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// ── Simulated Driver Pool ───────────────────────────────────────────────────

export interface SimDriver {
  id: string;
  name: string;
  initials: string;
  vehicle: string;
  plate: string;
  rating: number;
  coords: LatLng;
  heading: number;
  status: "online" | "offline";
  busy: boolean;
}

const JAKARTA_CENTER: LatLng = [-6.2088, 106.8456];

function randomNear(center: LatLng, radiusKm: number): LatLng {
  const dLat = ((Math.random() - 0.5) * 2 * radiusKm) / 111;
  const dLng = ((Math.random() - 0.5) * 2 * radiusKm) / (111 * Math.cos((center[0] * Math.PI) / 180));
  return [center[0] + dLat, center[1] + dLng];
}

const DRIVER_TEMPLATES = [
  { name: "Ahmad Rizki", initials: "AR", vehicle: "Toyota Avanza", plate: "B 1234 XYZ", rating: 4.9 },
  { name: "Budi Santoso", initials: "BS", vehicle: "Honda Brio", plate: "B 5678 ABC", rating: 4.7 },
  { name: "Cahya Dewi", initials: "CD", vehicle: "Daihatsu Xenia", plate: "B 9012 DEF", rating: 4.8 },
  { name: "Dian Prasetyo", initials: "DP", vehicle: "Suzuki Ertiga", plate: "B 3456 GHI", rating: 4.6 },
  { name: "Eko Wijaya", initials: "EW", vehicle: "Toyota Calya", plate: "B 7890 JKL", rating: 4.5 },
  { name: "Faisal Rahman", initials: "FR", vehicle: "Mitsubishi Xpander", plate: "B 2345 MNO", rating: 4.8 },
  { name: "Gita Permata", initials: "GP", vehicle: "Honda Mobilio", plate: "B 6789 PQR", rating: 4.7 },
];

// ── Dispatch Engine ─────────────────────────────────────────────────────────

const MAX_RADIUS_KM = 5;
const DISPATCH_TIMEOUT_MS = 15000;
const AUTO_ACCEPT_DELAY_MS = () => 2000 + Math.random() * 2000;

export interface MatchedDriver {
  id: string;
  name: string;
  initials: string;
  vehicle: string;
  plate: string;
  rating: number;
  coords: LatLng;
  distance: number;
}

export interface DispatchResult {
  success: boolean;
  driver?: MatchedDriver;
  reason?: "no_drivers" | "timeout" | "rejected";
}

class DispatchEngine {
  private drivers: SimDriver[] = [];
  private driftTimers: ReturnType<typeof setInterval>[] = [];
  private _initialized = false;

  /** Initialize the simulated driver pool */
  init() {
    if (this._initialized) return;
    this._initialized = true;

    this.drivers = DRIVER_TEMPLATES.map((t, i) => ({
      ...t,
      id: `sim-driver-${i + 1}`,
      coords: randomNear(JAKARTA_CENTER, 3),
      heading: Math.random() * 360,
      status: "online" as const,
      busy: false,
    }));

    // Drift drivers slightly every 3s and broadcast positions
    const timer = setInterval(() => {
      this.drivers.forEach((d) => {
        if (d.status !== "online" || d.busy) return;
        const dLat = (Math.random() - 0.5) * 0.0008;
        const dLng = (Math.random() - 0.5) * 0.0008;
        d.coords = [d.coords[0] + dLat, d.coords[1] + dLng];
        d.heading = (d.heading + (Math.random() - 0.5) * 40) % 360;

        realtime.publish("driver:location", {
          driverId: d.id,
          coords: d.coords,
          heading: d.heading,
          speed: 15 + Math.random() * 25,
          timestamp: Date.now(),
        });
      });
    }, 3000);

    this.driftTimers.push(timer);
  }

  /** Get current positions of all online, non-busy drivers */
  getAvailableDriverPositions(): { id: string; coords: LatLng; heading: number }[] {
    return this.drivers
      .filter((d) => d.status === "online" && !d.busy)
      .map((d) => ({ id: d.id, coords: d.coords, heading: d.heading }));
  }

  /** Find nearest available driver to pickup within MAX_RADIUS */
  findNearest(pickup: LatLng): (SimDriver & { distance: number })[] {
    return this.drivers
      .filter((d) => d.status === "online" && !d.busy)
      .map((d) => ({ ...d, distance: haversineDistance(pickup, d.coords) }))
      .filter((d) => d.distance <= MAX_RADIUS_KM)
      .sort((a, b) => a.distance - b.distance);
  }

  /** Request a ride — returns a Promise that resolves when driver accepts or times out */
  requestRide(
    pickup: { label: string; coords: LatLng },
    dropoff: { label: string; coords: LatLng },
    fare: number,
    passengerName: string
  ): Promise<DispatchResult> {
    this.init();

    const candidates = this.findNearest(pickup.coords);
    if (candidates.length === 0) {
      return Promise.resolve({ success: false, reason: "no_drivers" });
    }

    const requestId = `REQ-${Date.now()}`;
    const bestDriver = candidates[0];

    // Publish dispatch request (cross-tab for real driver tab)
    realtime.publish("dispatch:request", {
      requestId,
      pickup,
      dropoff,
      fare,
      passengerName,
      estimatedDistance: `${bestDriver.distance.toFixed(1)} km`,
      estimatedDuration: `${Math.ceil(bestDriver.distance * 3)} min`,
    });

    return new Promise<DispatchResult>((resolve) => {
      let settled = false;

      // Listen for response from driver tab
      const unsub = realtime.subscribe("dispatch:response", (data) => {
        if (data.requestId !== requestId || settled) return;
        settled = true;
        unsub();
        clearTimeout(timeoutId);
        clearTimeout(autoAcceptId);

        if (data.accepted) {
          const driver = this.drivers.find((d) => d.id === data.driverId) || bestDriver;
          driver.busy = true;
          resolve({
            success: true,
            driver: {
              id: driver.id,
              name: driver.name,
              initials: driver.initials,
              vehicle: driver.vehicle,
              plate: driver.plate,
              rating: driver.rating,
              coords: driver.coords,
              distance: haversineDistance(pickup.coords, driver.coords),
            },
          });
        } else {
          resolve({ success: false, reason: "rejected" });
        }
      });

      // Auto-accept in single-tab mode after a delay (simulating driver accepting)
      const autoAcceptId = setTimeout(() => {
        if (settled) return;
        settled = true;
        unsub();
        clearTimeout(timeoutId);

        bestDriver.busy = true;

        // Publish response so RideTracking picks it up
        realtime.publish("dispatch:response", {
          requestId,
          accepted: true,
          driverId: bestDriver.id,
        });

        resolve({
          success: true,
          driver: {
            id: bestDriver.id,
            name: bestDriver.name,
            initials: bestDriver.initials,
            vehicle: bestDriver.vehicle,
            plate: bestDriver.plate,
            rating: bestDriver.rating,
            coords: bestDriver.coords,
            distance: bestDriver.distance,
          },
        });
      }, AUTO_ACCEPT_DELAY_MS());

      // Timeout
      const timeoutId = setTimeout(() => {
        if (settled) return;
        settled = true;
        unsub();
        clearTimeout(autoAcceptId);
        resolve({ success: false, reason: "timeout" });
      }, DISPATCH_TIMEOUT_MS);
    });
  }

  /** Release a driver (trip ended) */
  releaseDriver(driverId: string) {
    const d = this.drivers.find((dr) => dr.id === driverId);
    if (d) d.busy = false;
  }

  destroy() {
    this.driftTimers.forEach(clearInterval);
    this.driftTimers = [];
    this.drivers = [];
    this._initialized = false;
  }
}

// Singleton
export const dispatch = new DispatchEngine();
