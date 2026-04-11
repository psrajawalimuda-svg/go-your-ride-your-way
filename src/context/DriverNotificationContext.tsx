import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { realtime, DispatchRequestPayload } from "@/lib/realtime";
import { useDriver } from "@/context/DriverContext";
import { toast } from "sonner";

interface DriverNotificationContextType {
  queue: DispatchRequestPayload[];
  currentNotification: DispatchRequestPayload | null;
  acceptCurrent: () => void;
  declineCurrent: () => void;
}

const DriverNotificationContext = createContext<DriverNotificationContextType | null>(null);

export function DriverNotificationProvider({ children }: { children: ReactNode }) {
  const { status, tripStatus, acceptRide, rejectRide, driverId } = useDriver();
  const [queue, setQueue] = useState<DispatchRequestPayload[]>([]);
  const [currentNotification, setCurrentNotification] = useState<DispatchRequestPayload | null>(null);

  // 1. Listen for incoming dispatch requests
  useEffect(() => {
    if (status !== "online") {
      setQueue([]);
      setCurrentNotification(null);
      return;
    }

    const unsub = realtime.subscribe("dispatch:request", (data) => {
      // Only queue if it's for this driver (targeted) or broadcast (no driverId)
      if (data.driverId && data.driverId !== driverId) return;
      
      // Don't queue if driver is already on a trip
      if (tripStatus !== "idle") {
        if (data.driverId === driverId) {
          // Send busy response if targeted
          realtime.publish("dispatch:response", {
            requestId: data.requestId,
            accepted: false,
            driverId: driverId || "unknown",
            reason: "busy"
          });
        }
        return;
      }

      setQueue((prev) => [...prev, data]);
    });

    return () => unsub();
  }, [status, tripStatus, driverId]);

  // 2. Process queue (show one at a time)
  useEffect(() => {
    if (!currentNotification && queue.length > 0) {
      const next = queue[0];
      setQueue((prev) => prev.slice(1));
      setCurrentNotification(next);
      
      // Feedback: Sound and Vibration simulation
      if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
      const audio = new Audio("/sounds/new-request.mp3");
      audio.play().catch(() => {}); // Browsers might block auto-play
    }
  }, [queue, currentNotification]);

  // 3. Auto-dismiss after 30s
  useEffect(() => {
    if (!currentNotification) return;

    const timer = setTimeout(() => {
      declineCurrent("timeout");
    }, 30000);

    return () => clearTimeout(timer);
  }, [currentNotification]);

  const acceptCurrent = useCallback(() => {
    if (!currentNotification) return;
    
    realtime.publish("dispatch:response", {
      requestId: currentNotification.requestId,
      accepted: true,
      driverId: driverId || "sim-driver-1" // Fallback for sim
    });

    acceptRide({
      id: currentNotification.requestId,
      passengerName: currentNotification.passengerName,
      pickup: currentNotification.pickup,
      dropoff: currentNotification.dropoff,
      estimatedFare: currentNotification.fare,
      estimatedDistance: currentNotification.estimatedDistance,
      estimatedDuration: currentNotification.estimatedDuration,
    });
    setCurrentNotification(null);
  }, [currentNotification, driverId, acceptRide]);

  const declineCurrent = useCallback((reason: any = "declined") => {
    if (!currentNotification) return;

    realtime.publish("dispatch:response", {
      requestId: currentNotification.requestId,
      accepted: false,
      driverId: driverId || "sim-driver-1",
      reason
    });

    setCurrentNotification(null);
  }, [currentNotification, driverId]);

  return (
    <DriverNotificationContext.Provider value={{ 
      queue, 
      currentNotification, 
      acceptCurrent, 
      declineCurrent 
    }}>
      {children}
    </DriverNotificationContext.Provider>
  );
}

export function useDriverNotifications() {
  const ctx = useContext(DriverNotificationContext);
  if (!ctx) throw new Error("useDriverNotifications must be used within DriverNotificationProvider");
  return ctx;
}
