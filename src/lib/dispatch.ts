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
const DISPATCH_TIMEOUT_MS = 30000; // Total timeout for whole dispatch process
const DRIVER_RESPONSE_TIMEOUT_MS = 10000; // Individual driver response timeout

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

  /** Find nearest available drivers within radius, sorted by score (distance + rating) */
  findBestDrivers(pickup: LatLng, radiusKm = MAX_RADIUS_KM): (SimDriver & { distance: number; score: number })[] {
    return this.drivers
      .filter((d) => d.status === "online" && !d.busy)
      .map((d) => {
        const distance = haversineDistance(pickup, d.coords);
        // Score: lower is better. 1km = 0.1 rating points.
        const score = distance - (d.rating - 4.0) * 2;
        return { ...d, distance, score };
      })
      .filter((d) => d.distance <= radiusKm)
      .sort((a, b) => a.score - b.score);
  }

  /** Request a ride — implements sequential intelligent dispatch */
  async requestRide(
    pickup: { label: string; coords: LatLng },
    dropoff: { label: string; coords: LatLng },
    fare: number,
    passengerName: string,
    priority: "normal" | "premium" | "emergency" = "normal"
  ): Promise<DispatchResult> {
    this.init();

    const radius = priority === "emergency" ? 10 : MAX_RADIUS_KM;
    const candidates = this.findBestDrivers(pickup.coords, radius);
    
    if (candidates.length === 0) {
      return { success: false, reason: "no_drivers" };
    }

    const requestId = `REQ-${Date.now()}`;
    const overallTimeout = setTimeout(() => {}, DISPATCH_TIMEOUT_MS);

    // Try up to 3 nearest drivers sequentially
    const driversToTry = candidates.slice(0, 3);
    
    for (const targetDriver of driversToTry) {
      const result = await this.dispatchToDriver(requestId, targetDriver, pickup, dropoff, fare, passengerName, priority);
      if (result.success) {
        clearTimeout(overallTimeout);
        return result;
      }
      if (result.reason === "timeout") {
        if (import.meta.env.DEV) console.log(`Driver ${targetDriver.name} timed out, trying next...`);
        continue;
      }
      if (result.reason === "rejected") {
        if (import.meta.env.DEV) console.log(`Driver ${targetDriver.name} rejected, trying next...`);
        continue;
      }
    }

    clearTimeout(overallTimeout);
    return { success: false, reason: "timeout" };
  }

  private dispatchToDriver(
    requestId: string,
    driver: SimDriver & { distance: number },
    pickup: { label: string; coords: LatLng },
    dropoff: { label: string; coords: LatLng },
    fare: number,
    passengerName: string,
    priority: string
  ): Promise<DispatchResult> {
    return new Promise((resolve) => {
      let settled = false;

      // 1. Publish targeted request
      realtime.publish("dispatch:request", {
        requestId,
        pickup,
        dropoff,
        fare,
        passengerName,
        estimatedDistance: `${driver.distance.toFixed(1)} km`,
        estimatedDuration: `${Math.ceil(driver.distance * 3)} min`,
        priority: priority as any,
        driverId: driver.id
      });

      // 2. Listen for response
      const unsub = realtime.subscribe("dispatch:response", (data) => {
        if (data.requestId !== requestId || data.driverId !== driver.id || settled) return;
        settled = true;
        unsub();
        clearTimeout(timerId);

        if (data.accepted) {
          const d = this.drivers.find(dr => dr.id === driver.id);
          if (d) d.busy = true;
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
              distance: driver.distance,
            }
          });
        } else {
          resolve({ success: false, reason: "rejected" });
        }
      });

      // 3. Driver timeout (no response)
      const timerId = setTimeout(() => {
        if (settled) return;
        settled = true;
        unsub();
        resolve({ success: false, reason: "timeout" });
      }, DRIVER_RESPONSE_TIMEOUT_MS);
    });
  }

  destroy() {
    this.driftTimers.forEach(clearInterval);
    this.driftTimers = [];
    this.drivers = [];
    this._initialized = false;
  }

  /** Release a driver after a trip or cancellation */
  releaseDriver(id: string) {
    const d = this.drivers.find((dr) => dr.id === id);
    if (d) d.busy = false;
  }
}

// Singleton
export const dispatch = new DispatchEngine();
