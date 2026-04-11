import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDriver } from "@/context/DriverContext";
import { useDriverNotifications } from "@/context/DriverNotificationContext";
import { DriverLayout } from "@/components/driver/DriverLayout";
import { MapView } from "@/components/MapView";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Clock, DollarSign, X, Check, User, LogOut, BarChart3, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectionStatusBadge } from "@/components/ConnectionStatusBadge";

export default function DriverHome() {
  const navigate = useNavigate();
  const {
    isAuthenticated, driverName, status, tripStatus,
    toggleStatus, logout,
  } = useDriver();

  const { 
    currentNotification, 
    acceptCurrent, 
    declineCurrent,
    queue
  } = useDriverNotifications();

  useEffect(() => {
    if (!isAuthenticated) navigate("/driver/login");
  }, [isAuthenticated, navigate]);

  const handleAccept = useCallback(() => {
    acceptCurrent();
    navigate("/driver/trip");
  }, [acceptCurrent, navigate]);

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
                  {status === "online" && <ConnectionStatusBadge />}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={status === "online"} onCheckedChange={toggleStatus} />
              {queue.length > 0 && (
                <div className="relative">
                  <Bell className="h-5 w-5 text-primary animate-bounce" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {queue.length}
                  </span>
                </div>
              )}
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

        {status === "online" && tripStatus === "idle" && !currentNotification && (
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
          {currentNotification && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 z-[1001] p-4"
            >
              <Card className="p-5 bg-card border-2 border-primary/30 shadow-xl relative overflow-hidden">
                {/* Progress bar for auto-dismiss */}
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: 0 }}
                  transition={{ duration: 30, ease: "linear" }}
                  className="absolute top-0 left-0 h-1 bg-primary/20"
                />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-foreground">New Ride Request</h3>
                    {currentNotification.priority === "premium" && (
                      <Badge className="bg-amber-500 text-white text-[10px]">PREMIUM</Badge>
                    )}
                    {currentNotification.priority === "emergency" && (
                      <Badge variant="destructive" className="animate-pulse text-[10px]">EMERGENCY</Badge>
                    )}
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">
                    {currentNotification.estimatedDuration}
                  </span>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pickup</p>
                      <p className="font-medium text-sm text-foreground">{currentNotification.pickup.label}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center mt-0.5">
                      <Navigation className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Dropoff</p>
                      <p className="font-medium text-sm text-foreground">{currentNotification.dropoff.label}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-5 px-2">
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{currentNotification.passengerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{currentNotification.estimatedDistance}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-bold text-foreground">{formatRupiah(currentNotification.fare)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={() => declineCurrent()}
                    className="h-14 text-base font-bold rounded-xl"
                  >
                    <X className="mr-1 h-5 w-5" /> Reject
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleAccept}
                    className="h-14 text-base font-bold rounded-xl shadow-lg shadow-primary/20"
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
