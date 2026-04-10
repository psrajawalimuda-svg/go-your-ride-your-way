import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDriver } from "@/context/DriverContext";
import { DriverLayout } from "@/components/driver/DriverLayout";
import { MapView } from "@/components/MapView";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Clock, DollarSign, X, Check, User, LogOut, BarChart3, Wifi, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useConnectionStatus } from "@/hooks/use-realtime";

export default function DriverHome() {
  const navigate = useNavigate();
  const {
    isAuthenticated, driverName, status, tripStatus, currentRequest,
    toggleStatus, acceptRide, rejectRide, simulateRequest, logout,
  } = useDriver();

  const connectionStatus = useConnectionStatus();

  useEffect(() => {
    if (!isAuthenticated) navigate("/driver/login");
  }, [isAuthenticated, navigate]);

  // Simulate incoming requests when online (fallback if no cross-tab dispatch)
  useEffect(() => {
    if (status !== "online" || tripStatus !== "idle") return;
    const timer = setTimeout(() => simulateRequest(), 8000 + Math.random() * 12000);
    return () => clearTimeout(timer);
  }, [status, tripStatus, simulateRequest]);

  const handleAccept = useCallback(() => {
    acceptRide();
    navigate("/driver/trip");
  }, [acceptRide, navigate]);

  const formatRupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  return (
    <DriverLayout noPadding>
      <div className="relative h-screen">
        {/* Map */}
        <MapView
          className="h-full"
          useGeolocation
          showLocateButton
          nearbyDrivers={status === "online" ? [[-6.21, 106.85], [-6.2, 106.84]] : undefined}
        />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-[1000] p-4">
          <Card className="p-3 flex items-center justify-between bg-card/95 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{driverName}</p>
                <div className="flex items-center gap-1.5">
                  <p className={`text-xs font-medium ${status === "online" ? "text-primary" : "text-muted-foreground"}`}>
                    {status === "online" ? "Online" : "Offline"}
                  </p>
                  {status === "online" && (
                    <span className="flex items-center gap-0.5">
                      {connectionStatus === "connected" ? (
                        <Wifi className="h-3 w-3 text-primary" />
                      ) : (
                        <WifiOff className="h-3 w-3 text-destructive" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={status === "online"} onCheckedChange={toggleStatus} />
              <button onClick={() => navigate("/driver/earnings")} className="p-2 hover:bg-secondary rounded-lg">
                <BarChart3 className="h-5 w-5 text-foreground" />
              </button>
              <button onClick={logout} className="p-2 hover:bg-secondary rounded-lg">
                <LogOut className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </Card>
        </div>

        {/* Status banner */}
        {status === "offline" && (
          <div className="absolute bottom-8 left-4 right-4 z-[1000]">
            <Card className="p-4 text-center bg-card/95 backdrop-blur-sm">
              <p className="text-muted-foreground text-sm">You are currently offline</p>
              <p className="text-xs text-muted-foreground mt-1">Toggle the switch above to start receiving ride requests</p>
            </Card>
          </div>
        )}

        {status === "online" && tripStatus === "idle" && (
          <div className="absolute bottom-8 left-4 right-4 z-[1000]">
            <Card className="p-4 text-center bg-card/95 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <p className="text-sm font-medium text-foreground">Waiting for ride requests…</p>
              </div>
            </Card>
          </div>
        )}

        {/* Ride Request Overlay */}
        <AnimatePresence>
          {tripStatus === "requesting" && currentRequest && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 z-[1001] p-4"
            >
              <Card className="p-5 bg-card border-2 border-primary/30 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-foreground">New Ride Request</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">
                    {currentRequest.estimatedDuration}
                  </span>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pickup</p>
                      <p className="font-medium text-sm text-foreground">{currentRequest.pickup.label}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center mt-0.5">
                      <Navigation className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Dropoff</p>
                      <p className="font-medium text-sm text-foreground">{currentRequest.dropoff.label}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-5 px-2">
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{currentRequest.passengerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{currentRequest.estimatedDistance}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-bold text-foreground">{formatRupiah(currentRequest.estimatedFare)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={rejectRide}
                    className="h-14 text-base font-bold rounded-xl"
                  >
                    <X className="mr-1 h-5 w-5" /> Reject
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleAccept}
                    className="h-14 text-base font-bold rounded-xl"
                  >
                    <Check className="mr-1 h-5 w-5" /> Accept
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DriverLayout>
  );
}
