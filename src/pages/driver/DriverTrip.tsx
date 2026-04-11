import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDriver } from "@/context/DriverContext";
import { DriverLayout } from "@/components/driver/DriverLayout";
import { MapView } from "@/components/MapView";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, User, Phone, MessageSquare, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { realtime } from "@/lib/realtime";
import { generateRoutePoints } from "@/components/MapView";

const STATUS_LABELS: Record<string, { label: string; action: string }> = {
  navigating_to_pickup: { label: "Navigating to pickup", action: "Arrived at Pickup" },
  at_pickup: { label: "Waiting for passenger", action: "Start Trip" },
  on_trip: { label: "Trip in progress", action: "Complete Trip" },
  completed: { label: "Trip completed!", action: "Back to Home" },
};

export default function DriverTrip() {
  const navigate = useNavigate();
  const { isAuthenticated, driverId, tripStatus, currentTrip, advanceTrip } = useDriver();
  const locationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef(0);

  useEffect(() => {
    if (!isAuthenticated) navigate("/driver/login");
    if (tripStatus === "idle" && !currentTrip) navigate("/driver/home");
  }, [isAuthenticated, tripStatus, currentTrip, navigate]);

  // Broadcast driver location along route during active trip — finer-grained, 2s intervals
  useEffect(() => {
    if (!currentTrip) return;

    if (tripStatus === "navigating_to_pickup" || tripStatus === "on_trip") {
      const start = tripStatus === "navigating_to_pickup"
        ? [-6.2088, 106.8456] as [number, number]
        : currentTrip.pickup.coords;
      const end = tripStatus === "navigating_to_pickup"
        ? currentTrip.pickup.coords
        : currentTrip.dropoff.coords;

      const routePoints = generateRoutePoints(start, end, 80);
      stepRef.current = 0;

      locationIntervalRef.current = setInterval(() => {
        if (stepRef.current < routePoints.length) {
          // Variable speed: slower near turns
          const speed = 25 + Math.random() * 35;
          const heading = stepRef.current > 0
            ? Math.atan2(
                routePoints[stepRef.current][1] - routePoints[stepRef.current - 1][1],
                routePoints[stepRef.current][0] - routePoints[stepRef.current - 1][0]
              ) * (180 / Math.PI)
            : 0;

          realtime.publish("driver:location", {
            driverId,
            coords: routePoints[stepRef.current],
            heading,
            speed,
            timestamp: Date.now(),
          });
          stepRef.current++;
        }
      }, 2000);
    }

    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
    };
  }, [tripStatus, currentTrip, driverId]);

  if (!currentTrip) return null;

  const statusInfo = STATUS_LABELS[tripStatus] || STATUS_LABELS.navigating_to_pickup;
  const formatRupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  const handleAction = () => {
    advanceTrip();
    if (tripStatus === "completed") navigate("/driver/home");
  };

  return (
    <DriverLayout noPadding>
      <div className="relative h-screen">
        <MapView
          className="h-full"
          pickupPosition={currentTrip.pickup.coords}
          destinationPosition={currentTrip.dropoff.coords}
          showRoute
          animateMarker={tripStatus === "on_trip"}
          showLocateButton={false}
        />

        {/* Status header */}
        <div className="absolute top-0 left-0 right-0 z-[1000] p-4">
          <Card className="p-3 bg-card/95 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${tripStatus === "completed" ? "bg-primary" : "bg-primary animate-pulse"}`} />
              <span className="font-semibold text-sm text-foreground">{statusInfo.label}</span>
            </div>
          </Card>
        </div>

        {/* Bottom panel */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          className="absolute bottom-0 left-0 right-0 z-[1000]"
        >
          <Card className="rounded-b-none rounded-t-2xl p-5 bg-card shadow-xl border-t">
            {tripStatus === "completed" ? (
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
                <div>
                  <p className="font-bold text-lg text-foreground">Trip Complete!</p>
                  <p className="text-2xl font-bold text-primary mt-1">{formatRupiah(currentTrip.estimatedFare)}</p>
                </div>
                <Button onClick={handleAction} className="w-full h-14 text-base font-bold rounded-xl">
                  {statusInfo.action}
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{currentTrip.passengerName}</p>
                      <p className="text-xs text-muted-foreground">{formatRupiah(currentTrip.estimatedFare)} • {currentTrip.estimatedDistance}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <Phone className="h-4 w-4 text-foreground" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-foreground" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pickup</p>
                      <p className="text-sm font-medium text-foreground">{currentTrip.pickup.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                    <Navigation className="h-4 w-4 text-accent-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Dropoff</p>
                      <p className="text-sm font-medium text-foreground">{currentTrip.dropoff.label}</p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleAction} className="w-full h-14 text-base font-bold rounded-xl">
                  {statusInfo.action}
                </Button>
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </DriverLayout>
  );
}
