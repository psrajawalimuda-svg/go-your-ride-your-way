import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import type { DriverStatus as ModelDriverStatus, LatLng } from "@/types/models";
import { realtime } from "@/lib/realtime";
import { useLocationBroadcast } from "@/hooks/use-realtime";

export type DriverStatus = ModelDriverStatus;
export type TripStatus = "idle" | "requesting" | "navigating_to_pickup" | "at_pickup" | "on_trip" | "completed";

export interface RideRequest {
  id: string;
  passengerName: string;
  pickup: { label: string; coords: LatLng };
  dropoff: { label: string; coords: LatLng };
  estimatedFare: number;
  estimatedDistance: string;
  estimatedDuration: string;
}

export interface TripRecord {
  id: string;
  passengerName: string;
  pickup: string;
  dropoff: string;
  fare: number;
  date: string;
  time: string;
}

interface DriverState {
  isAuthenticated: boolean;
  phone: string;
  driverName: string;
  driverId: string;
  status: DriverStatus;
  tripStatus: TripStatus;
  currentRequest: RideRequest | null;
  currentTrip: RideRequest | null;
  earnings: { today: number; week: number; month: number };
  tripHistory: TripRecord[];
  login: (phone: string) => void;
  logout: () => void;
  toggleStatus: () => void;
  acceptRide: () => void;
  rejectRide: () => void;
  advanceTrip: () => void;
  simulateRequest: () => void;
}

const DriverContext = createContext<DriverState>({} as DriverState);

const DRIVER_ID = "driver-001";

const MOCK_REQUESTS: RideRequest[] = [
  {
    id: "REQ-001",
    passengerName: "Andi Pratama",
    pickup: { label: "Mall Grand Indonesia", coords: [-6.195, 106.822] },
    dropoff: { label: "Senayan City", coords: [-6.227, 106.797] },
    estimatedFare: 35000,
    estimatedDistance: "4.2 km",
    estimatedDuration: "12 min",
  },
  {
    id: "REQ-002",
    passengerName: "Siti Rahayu",
    pickup: { label: "Stasiun Gambir", coords: [-6.177, 106.83] },
    dropoff: { label: "Monas", coords: [-6.175, 106.827] },
    estimatedFare: 15000,
    estimatedDistance: "1.1 km",
    estimatedDuration: "5 min",
  },
  {
    id: "REQ-003",
    passengerName: "Budi Santoso",
    pickup: { label: "Plaza Indonesia", coords: [-6.193, 106.821] },
    dropoff: { label: "Kuningan City", coords: [-6.228, 106.829] },
    estimatedFare: 42000,
    estimatedDistance: "5.8 km",
    estimatedDuration: "18 min",
  },
];

export function DriverProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<DriverStatus>("offline");
  const [tripStatus, setTripStatus] = useState<TripStatus>("idle");
  const [currentRequest, setCurrentRequest] = useState<RideRequest | null>(null);
  const [currentTrip, setCurrentTrip] = useState<RideRequest | null>(null);
  const [earnings, setEarnings] = useState({ today: 185000, week: 1250000, month: 4800000 });
  const [tripHistory, setTripHistory] = useState<TripRecord[]>([
    { id: "T-101", passengerName: "Dewi Lestari", pickup: "Sudirman", dropoff: "Kemang", fare: 32000, date: "2026-04-09", time: "08:30" },
    { id: "T-102", passengerName: "Rudi Hartono", pickup: "Thamrin", dropoff: "Menteng", fare: 18000, date: "2026-04-09", time: "10:15" },
    { id: "T-103", passengerName: "Maya Sari", pickup: "Blok M", dropoff: "Pondok Indah", fare: 45000, date: "2026-04-08", time: "14:00" },
  ]);

  // Broadcast location when online and idle (not on active trip — trip page handles that)
  useLocationBroadcast(
    isAuthenticated ? DRIVER_ID : null,
    status === "online" && tripStatus === "idle"
  );

  const login = useCallback((ph: string) => {
    setPhone(ph);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setPhone("");
    setStatus("offline");
    setTripStatus("idle");
    setCurrentRequest(null);
    setCurrentTrip(null);
  }, []);

  const toggleStatus = useCallback(() => {
    setStatus((s) => (s === "offline" ? "online" : "offline"));
    if (status === "online") {
      setCurrentRequest(null);
      setTripStatus("idle");
    }
  }, [status]);

  const simulateRequest = useCallback(() => {
    if (status !== "online" || tripStatus !== "idle") return;
    const req = MOCK_REQUESTS[Math.floor(Math.random() * MOCK_REQUESTS.length)];
    const request = { ...req, id: `REQ-${Date.now()}` };
    setCurrentRequest(request);
    setTripStatus("requesting");
  }, [status, tripStatus]);

  const acceptRide = useCallback((request: RideRequest) => {
    setCurrentTrip(request);
    setTripStatus("navigating_to_pickup");

    // Publish trip status
    realtime.publish("trip:status", {
      tripId: request.id,
      status: "navigating_to_pickup",
      timestamp: Date.now(),
    });
  }, []);

  const rejectRide = useCallback(() => {
    if (currentRequest) {
      realtime.publish("dispatch:response", {
        requestId: currentRequest.id,
        accepted: false,
        driverId: DRIVER_ID,
      });
    }
    setCurrentRequest(null);
    setTripStatus("idle");
  }, [currentRequest]);

  const advanceTrip = useCallback(() => {
    setTripStatus((prev) => {
      let next: TripStatus = prev;
      switch (prev) {
        case "navigating_to_pickup": next = "at_pickup"; break;
        case "at_pickup": next = "on_trip"; break;
        case "on_trip": {
          if (currentTrip) {
            const record: TripRecord = {
              id: currentTrip.id,
              passengerName: currentTrip.passengerName,
              pickup: currentTrip.pickup.label,
              dropoff: currentTrip.dropoff.label,
              fare: currentTrip.estimatedFare,
              date: new Date().toISOString().split("T")[0],
              time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
            };
            setTripHistory((h) => [record, ...h]);
            setEarnings((e) => ({
              today: e.today + currentTrip.estimatedFare,
              week: e.week + currentTrip.estimatedFare,
              month: e.month + currentTrip.estimatedFare,
            }));
          }
          next = "completed";
          break;
        }
        case "completed": {
          setCurrentTrip(null);
          next = "idle";
          break;
        }
        default: break;
      }

      // Publish status change via realtime
      if (currentTrip && next !== prev) {
        realtime.publish("trip:status", {
          tripId: currentTrip.id,
          status: next,
          timestamp: Date.now(),
        });
      }

      return next;
    });
  }, [currentTrip]);

  return (
    <DriverContext.Provider
      value={{
        isAuthenticated,
        phone,
        driverName: "Ahmad Fauzi",
        driverId: DRIVER_ID,
        status,
        tripStatus,
        currentRequest,
        currentTrip,
        earnings,
        tripHistory,
        login,
        logout,
        toggleStatus,
        acceptRide,
        rejectRide,
        advanceTrip,
        simulateRequest,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
}

export const useDriver = () => useContext(DriverContext);
