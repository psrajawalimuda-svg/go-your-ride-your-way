import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { VehicleClass, PaymentMethodType, TripStatus as ModelTripStatus } from "@/types/models";
import { dispatch, type MatchedDriver, type DispatchResult } from "@/lib/dispatch";

// Re-export for backward compatibility
export type VehicleType = VehicleClass;
export type PaymentMethod = PaymentMethodType;
export type RideStatus = ModelTripStatus;

export interface DriverInfo {
  id: string;
  name: string;
  initials: string;
  vehicle: string;
  plate: string;
  rating: number;
  coords: [number, number];
  distance: number;
}

interface RideData {
  pickup: { name: string; latlng: [number, number] | null };
  destination: { name: string; latlng: [number, number] | null };
  vehicle: VehicleType;
  payment: PaymentMethod;
  fare: string;
  status: RideStatus;
  driver: DriverInfo | null;
  tripId: string | null;
}

interface RideContextType {
  ride: RideData;
  setRide: (update: Partial<RideData>) => void;
  resetRide: () => void;
  requestRide: () => Promise<DispatchResult>;
}

const defaultRide: RideData = {
  pickup: { name: "", latlng: null },
  destination: { name: "", latlng: null },
  vehicle: "car",
  payment: "cash",
  fare: "Rp 25,000",
  status: "idle",
  driver: null,
  tripId: null,
};

const RideContext = createContext<RideContextType | null>(null);

export function RideProvider({ children }: { children: ReactNode }) {
  const [ride, setRideState] = useState<RideData>(defaultRide);

  const setRide = useCallback(
    (update: Partial<RideData>) => setRideState((prev) => ({ ...prev, ...update })),
    []
  );

  const resetRide = useCallback(() => {
    if (ride.driver?.id) dispatch.releaseDriver(ride.driver.id);
    setRideState(defaultRide);
  }, [ride.driver?.id]);

  const requestRide = useCallback(async (): Promise<DispatchResult> => {
    if (!ride.pickup.latlng || !ride.destination.latlng) {
      return { success: false, reason: "no_drivers" };
    }

    const fareNum = parseInt(ride.fare.replace(/\D/g, ""));
    const tripId = `TRIP-${Date.now()}`;

    setRideState((prev) => ({ ...prev, status: "searching", tripId }));

    const result = await dispatch.requestRide(
      { label: ride.pickup.name, coords: ride.pickup.latlng },
      { label: ride.destination.name, coords: ride.destination.latlng },
      fareNum,
      "Passenger"
    );

    if (result.success && result.driver) {
      setRideState((prev) => ({
        ...prev,
        status: "found",
        driver: result.driver!,
      }));
    } else {
      setRideState((prev) => ({ ...prev, status: "timeout" }));
    }

    return result;
  }, [ride.pickup, ride.destination, ride.fare]);

  return (
    <RideContext.Provider value={{ ride, setRide, resetRide, requestRide }}>
      {children}
    </RideContext.Provider>
  );
}

export function useRide() {
  const ctx = useContext(RideContext);
  if (!ctx) throw new Error("useRide must be used within RideProvider");
  return ctx;
}
