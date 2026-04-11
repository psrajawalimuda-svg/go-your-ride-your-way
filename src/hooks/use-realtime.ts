import { useState, useEffect, useCallback, useRef } from "react";
import {
  realtime,
  type RealtimeChannel,
  type ChannelPayloadMap,
  type ConnectionStatus,
  type DriverLocationPayload,
  type TripStatusPayload,
} from "@/lib/realtime";
import type { LatLng } from "@/types/models";

// ── Generic channel hook ────────────────────────────────────────────────────

export function useRealtimeChannel<C extends RealtimeChannel>(
  channel: C
): ChannelPayloadMap[C] | null {
  const [message, setMessage] = useState<ChannelPayloadMap[C] | null>(null);

  useEffect(() => {
    const unsub = realtime.subscribe(channel, (data) => setMessage(data));
    return unsub;
  }, [channel]);

  return message;
}

// ── Driver tracking hook ────────────────────────────────────────────────────

export function useDriverTracking(driverId: string | null) {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    if (!driverId) return;

    const unsub = realtime.subscribe("driver:location", (data: DriverLocationPayload) => {
      if (data.driverId === driverId) {
        setPosition(data.coords);
        setHeading(data.heading);
      }
    });

    return unsub;
  }, [driverId]);

  return { position, heading };
}

// ── Nearby drivers hook ─────────────────────────────────────────────────────

export function useNearbyDrivers() {
  const [drivers, setDrivers] = useState<Map<string, { coords: LatLng; heading: number }>>(new Map());

  useEffect(() => {
    const unsub = realtime.subscribe("driver:location", (data: DriverLocationPayload) => {
      setDrivers((prev) => {
        const next = new Map(prev);
        next.set(data.driverId, { coords: data.coords, heading: data.heading });
        return next;
      });
    });

    return unsub;
  }, []);

  // Convert to array for MapView consumption
  const driverList = Array.from(drivers.entries()).map(([id, d]) => ({
    id,
    coords: d.coords,
    heading: d.heading,
  }));

  return driverList;
}

// ── Trip status hook ────────────────────────────────────────────────────────

export function useTripStatus(tripId: string | null) {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) return;

    const unsub = realtime.subscribe("trip:status", (data: TripStatusPayload) => {
      if (data.tripId === tripId) {
        setStatus(data.status);
      }
    });

    return unsub;
  }, [tripId]);

  return status;
}

// ── Connection status hook ──────────────────────────────────────────────────

export function useConnectionStatus(): ConnectionStatus {
  const [status, setStatus] = useState<ConnectionStatus>(realtime.status);

  useEffect(() => {
    const unsub = realtime.onStatusChange(setStatus);
    return unsub;
  }, []);

  return status;
}

// ── Publish helper hook ─────────────────────────────────────────────────────

export function usePublish() {
  return useCallback(<C extends RealtimeChannel>(channel: C, data: ChannelPayloadMap[C]) => {
    realtime.publish(channel, data);
  }, []);
}

// ── Simulated location drift hook (for drivers) ─────────────────────────────

export function useLocationBroadcast(
  driverId: string | null,
  isOnline: boolean,
  baseCoords: LatLng = [-6.2088, 106.8456],
  intervalMs = 3000
) {
  const coordsRef = useRef<LatLng>(baseCoords);
  const headingRef = useRef(0);

  useEffect(() => {
    if (!driverId || !isOnline) return;

    coordsRef.current = baseCoords;

    const timer = setInterval(() => {
      const dLat = (Math.random() - 0.5) * 0.001;
      const dLng = (Math.random() - 0.5) * 0.001;
      coordsRef.current = [
        coordsRef.current[0] + dLat,
        coordsRef.current[1] + dLng,
      ];
      headingRef.current = (headingRef.current + (Math.random() - 0.5) * 30) % 360;

      realtime.publish("driver:location", {
        driverId,
        coords: coordsRef.current,
        heading: headingRef.current,
        speed: 20 + Math.random() * 30,
        timestamp: Date.now(),
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [driverId, isOnline, baseCoords, intervalMs]);
}
