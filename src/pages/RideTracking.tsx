import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Phone, MessageCircle, Star, Shield, Navigation, X, RefreshCw, Loader2, Clock, MapPin } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapView, generateRoutePoints } from "@/components/MapView";
import { RideBottomSheet } from "@/components/ride/RideBottomSheet";
import { useNavigate } from "react-router-dom";
import { useRide, type RideStatus } from "@/context/RideContext";
import { useNotifications } from "@/context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DRIVER = {
  name: "Ahmad Rizki",
  initials: "AR",
  vehicle: "Toyota Avanza",
  plate: "B 1234 XYZ",
  rating: 4.9,
};

const SEARCH_TIMEOUT = 15000;

export default function RideTracking() {
  const navigate = useNavigate();
  const { ride, setRide, resetRide } = useRide();
  const { sendNotification } = useNotifications();

  const pickupPos = ride.pickup.latlng || [-6.2088, 106.8456] as [number, number];
  const destPos = ride.destination.latlng || [-6.1751, 106.8650] as [number, number];

  const [status, setStatus] = useState<RideStatus>(ride.status === "searching" ? "searching" : "searching");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [etaSeconds, setEtaSeconds] = useState(0);
  const [driverPos, setDriverPos] = useState<[number, number]>(pickupPos);
  const stepRef = useRef(0);

  // Search timeout
  useEffect(() => {
    if (status !== "searching") return;
    const timer = setTimeout(() => setStatus("timeout"), SEARCH_TIMEOUT);
    // Simulate finding driver after 4s
    const findTimer = setTimeout(() => {
      setStatus("found");
      sendNotification(
        "driver_found",
        "Driver Found!",
        `${DRIVER.name} (${DRIVER.plate}) is on the way to pick you up.`,
        { driverId: "DRV-001", vehicle: DRIVER.vehicle }
      );
    }, 4000);
    return () => { clearTimeout(timer); clearTimeout(findTimer); };
  }, [status, sendNotification]);

  // Found → arriving after 3s
  useEffect(() => {
    if (status !== "found") return;
    setEtaSeconds(120);
    const t = setTimeout(() => setStatus("arriving"), 3000);
    return () => clearTimeout(t);
  }, [status]);

  // Arriving countdown + transition
  useEffect(() => {
    if (status !== "arriving") return;
    setEtaSeconds(60);
    const interval = setInterval(() => {
      setEtaSeconds((s) => {
        if (s <= 1) { clearInterval(interval); return 0; }
        return s - 1;
      });
    }, 1000);
    const t = setTimeout(() => {
      setStatus("on_trip");
      sendNotification(
        "trip_started",
        "Trip Started",
        "Your trip has started. Sit back and enjoy the ride!",
        { tripId: ride.pickup.name }
      );
    }, 8000);
    return () => { clearInterval(interval); clearTimeout(t); };
  }, [status, sendNotification, ride.pickup.name]);

  // On trip — animate along route, decrement ETA
  useEffect(() => {
    if (status !== "on_trip") return;
    const routePoints = generateRoutePoints(pickupPos, destPos, 60);
    stepRef.current = 0;
    setEtaSeconds(routePoints.length);

    const interval = setInterval(() => {
      stepRef.current++;
      if (stepRef.current < routePoints.length) {
        setDriverPos(routePoints[stepRef.current]);
        setEtaSeconds(routePoints.length - stepRef.current);
      } else {
        clearInterval(interval);
        setStatus("completed");
        sendNotification(
          "trip_completed",
          "Trip Completed",
          "You have arrived at your destination. Hope you had a great ride!",
          { tripId: ride.pickup.name, fare: ride.fare }
        );
      }
    }, 500);

    return () => clearInterval(interval);
  }, [status, pickupPos, destPos, sendNotification, ride.pickup.name, ride.fare]);

  const handleRetry = () => setStatus("searching");
  const handleCancel = () => { resetRide(); navigate("/home"); };

  const formatEta = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  const statusLabel: Record<RideStatus, string> = {
    idle: "",
    searching: "Finding your driver...",
    found: "Driver found!",
    arriving: "Driver is on the way",
    on_trip: "On trip",
    completed: "You've arrived!",
    cancelled: "Ride cancelled",
    timeout: "No drivers available",
  };

  return (
    <MobileLayout hideNav>
      <div className="min-h-screen bg-background relative">
        {/* Map */}
        <div className="h-screen w-full">
          <MapView
            pickupPosition={pickupPos}
            destinationPosition={destPos}
            showRoute
            animateMarker={status === "on_trip"}
            showLocateButton={false}
            markerPosition={status === "on_trip" ? driverPos : undefined}
          />
        </div>

        {/* Top controls */}
        <div className="absolute top-4 left-4 z-[1000]">
          <button onClick={() => setShowCancelDialog(true)} className="p-2 rounded-xl bg-card border border-border shadow-sm">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute top-4 right-4 z-[1000]">
          <button className="bg-destructive rounded-xl px-3 py-1.5 shadow-sm">
            <p className="text-xs font-bold text-destructive-foreground flex items-center gap-1">
              <Shield className="h-3 w-3" /> SOS
            </p>
          </button>
        </div>

        {/* Bottom sheet by status */}
        <RideBottomSheet animationKey={status}>
          {/* SEARCHING */}
          {status === "searching" && (
            <div className="space-y-4 text-center">
              <Loader2 className="h-10 w-10 text-primary mx-auto animate-spin" />
              <div>
                <p className="text-lg font-bold">{statusLabel.searching}</p>
                <p className="text-sm text-muted-foreground">
                  Looking for {ride.vehicle === "bike" ? "riders" : "drivers"} nearby
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="destructive" className="flex-1 h-12 rounded-2xl font-bold" onClick={() => setShowCancelDialog(true)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* TIMEOUT */}
          {status === "timeout" && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full mx-auto flex items-center justify-center">
                <X className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <p className="text-lg font-bold">{statusLabel.timeout}</p>
                <p className="text-sm text-muted-foreground">All drivers are busy. Please try again.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold" onClick={handleCancel}>
                  Go Back
                </Button>
                <Button className="flex-1 h-12 rounded-2xl font-bold" onClick={handleRetry}>
                  <RefreshCw className="h-4 w-4 mr-1" /> Retry
                </Button>
              </div>
            </div>
          )}

          {/* FOUND */}
          {status === "found" && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-bold">{statusLabel.found}</p>
              </div>
              <DriverCard />
            </div>
          )}

          {/* ARRIVING */}
          {status === "arriving" && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-bold">{statusLabel.arriving}</p>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> ETA: {formatEta(etaSeconds)}
                </p>
              </div>
              <DriverCard showActions />
              <Button variant="destructive" className="w-full h-12 rounded-2xl font-bold" onClick={() => setShowCancelDialog(true)}>
                Cancel Ride
              </Button>
            </div>
          )}

          {/* ON TRIP */}
          {status === "on_trip" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">{statusLabel.on_trip}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {ride.destination.name || "Destination"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{formatEta(etaSeconds)}</p>
                  <p className="text-xs text-muted-foreground">remaining</p>
                </div>
              </div>
              <DriverCard showActions />
              <Card className="p-3 rounded-2xl flex items-center justify-between">
                <span className="text-sm font-semibold">Estimated fare</span>
                <span className="text-lg font-bold text-primary">{ride.fare}</span>
              </Card>
            </div>
          )}

          {/* COMPLETED */}
          {status === "completed" && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <p className="text-lg font-bold">{statusLabel.completed}</p>
                <p className="text-sm text-muted-foreground">Rate your trip with {DRIVER.name}</p>
                <div className="flex justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setRating(s)}>
                      <Star
                        className={cn(
                          "h-8 w-8 cursor-pointer hover:scale-110 transition-transform",
                          s <= rating ? "text-accent fill-accent" : "text-border"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <Card className="p-4 rounded-2xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trip fare</span>
                  <span className="font-bold">{ride.fare}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment</span>
                  <span className="font-semibold capitalize">{ride.payment}</span>
                </div>
              </Card>

              <Button onClick={() => { resetRide(); navigate("/home"); }} className="w-full h-12 rounded-2xl text-base font-bold">
                Done
              </Button>
            </div>
          )}
        </RideBottomSheet>

        {/* Cancel dialog */}
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel ride?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this ride? You may be charged a cancellation fee.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Keep Ride</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancel} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Cancel Ride
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MobileLayout>
  );
}

function DriverCard({ showActions = false }: { showActions?: boolean }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
        {DRIVER.initials}
      </div>
      <div className="flex-1">
        <p className="font-bold">{DRIVER.name}</p>
        <p className="text-xs text-muted-foreground">{DRIVER.vehicle} • {DRIVER.plate}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Star className="h-3 w-3 fill-accent text-accent" />
          <span className="text-xs font-semibold">{DRIVER.rating}</span>
        </div>
      </div>
      {showActions && (
        <div className="flex gap-2">
          <button className="p-2.5 rounded-xl bg-primary/10">
            <Phone className="h-4 w-4 text-primary" />
          </button>
          <button className="p-2.5 rounded-xl bg-primary/10">
            <MessageCircle className="h-4 w-4 text-primary" />
          </button>
        </div>
      )}
    </div>
  );
}
