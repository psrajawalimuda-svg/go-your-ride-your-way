import { useState, useCallback, useMemo, useEffect } from "react";
import { ArrowLeft, MapPin, Navigation, Clock, Car, Bike, Truck, CreditCard, Wallet, Crosshair, Loader2, Search } from "lucide-react";
import { useGeocoding, type GeocodingResult } from "@/hooks/use-geocoding";
import { haversineDistance } from "@/lib/dispatch";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MapView } from "@/components/MapView";
import { RideBottomSheet } from "@/components/ride/RideBottomSheet";
import { useRide } from "@/context/RideContext";
import { usePayment } from "@/context/PaymentContext";
import { useNearbyDrivers } from "@/hooks/use-realtime";
import { dispatch } from "@/lib/dispatch";

const VEHICLE_CONFIG = [
  { id: "bike" as const, icon: Bike, label: "PYU Bike", eta: "3 min", baseFare: 2000, perKm: 1500, desc: "Affordable motorcycle ride" },
  { id: "car" as const, icon: Car, label: "PYU Car", eta: "5 min", baseFare: 5000, perKm: 4000, desc: "Comfortable car ride" },
  { id: "premium" as const, icon: Car, label: "PYU Premium", eta: "7 min", baseFare: 10000, perKm: 7000, desc: "Luxury experience" },
  { id: "womenbike" as const, icon: Bike, label: "PYU Women Bike", eta: "5 min", baseFare: 3000, perKm: 2000, desc: "Safe ride by female drivers" },
];

function formatRupiah(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

function calcFare(baseFare: number, perKm: number, distKm: number) {
  return Math.round((baseFare + distKm * perKm) / 1000) * 1000;
}

const defaultSuggestions: GeocodingResult[] = [
  { name: "Grand Indonesia Mall", addr: "Jl. MH Thamrin No. 1", latlng: [-6.1950, 106.8220] },
  { name: "Monas", addr: "Gambir, Central Jakarta", latlng: [-6.1754, 106.8272] },
  { name: "Blok M Plaza", addr: "Jl. Sultan Hasanuddin", latlng: [-6.2443, 106.7981] },
];

type Step = "location" | "fare" | "confirm";

export default function RideBooking() {
  const navigate = useNavigate();
  const { ride, setRide } = useRide();
  const { createTransaction } = usePayment();

  const [pickupName, setPickupName] = useState(ride.pickup.name);
  const [destName, setDestName] = useState(ride.destination.name);
  const [pickupPos, setPickupPos] = useState<[number, number] | null>(ride.pickup.latlng);
  const [destPos, setDestPos] = useState<[number, number] | null>(ride.destination.latlng);
  const [selectedVehicle, setSelectedVehicle] = useState(ride.vehicle);
  const [payment, setPayment] = useState(ride.payment);
  const [step, setStep] = useState<Step>("location");
  const [pickingField, setPickingField] = useState<"pickup" | "destination">("pickup");

  const searchQuery = pickingField === "pickup" ? pickupName : destName;
  const { results: geocodeResults, loading: geocodeLoading } = useGeocoding(searchQuery);
  const displayResults = geocodeResults.length > 0 ? geocodeResults : defaultSuggestions;

  // Initialize dispatch engine for simulated drivers
  useEffect(() => {
    dispatch.init();
  }, []);

  // Live nearby drivers from realtime
  const realtimeDrivers = useNearbyDrivers();
  const nearbyDriverPositions = useMemo<[number, number][]>(() => {
    if (realtimeDrivers.length > 0) {
      return realtimeDrivers.map((d) => d.coords as [number, number]);
    }
    // Fallback: static positions until dispatch engine starts broadcasting
    const base = pickupPos || [-6.2088, 106.8456];
    return Array.from({ length: 5 }, () => [
      base[0] + (Math.random() - 0.5) * 0.02,
      base[1] + (Math.random() - 0.5) * 0.02,
    ] as [number, number]);
  }, [realtimeDrivers, pickupPos]);

  const handleMapClick = useCallback((latlng: [number, number]) => {
    if (pickingField === "pickup") {
      setPickupPos(latlng);
      setPickupName(`${latlng[0].toFixed(4)}, ${latlng[1].toFixed(4)}`);
    } else {
      setDestPos(latlng);
      setDestName(`${latlng[0].toFixed(4)}, ${latlng[1].toFixed(4)}`);
    }
  }, [pickingField]);

  const handleSuggestion = (s: GeocodingResult) => {
    if (pickingField === "pickup" || (!pickupPos && !destPos)) {
      setPickupName(s.name);
      setPickupPos(s.latlng);
      setPickingField("destination");
    } else {
      setDestName(s.name);
      setDestPos(s.latlng);
    }
  };

  const handleUseMyLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const latlng: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setPickupName("My Location");
        setPickupPos(latlng);
        setPickingField("destination");
      });
    }
  };

  const canProceedToFare = pickupPos && destPos;

  const handleConfirmLocation = () => {
    if (canProceedToFare) setStep("fare");
  };

  const handleSelectVehicle = () => setStep("confirm");

  const handleBook = () => {
    const fare = vehicles.find((v) => v.id === selectedVehicle)?.price || "Rp 25,000";
    const fareNum = parseInt(fare.replace(/\D/g, ""));
    setRide({
      pickup: { name: pickupName, latlng: pickupPos },
      destination: { name: destName, latlng: destPos },
      vehicle: selectedVehicle,
      payment,
      fare,
      status: "searching",
    });
    createTransaction({
      amount: fareNum,
      description: `Ride: ${pickupName} → ${destName}`,
      returnPath: "/ride/tracking",
    });
    navigate("/payment");
  };

  const goBack = () => {
    if (step === "confirm") setStep("fare");
    else if (step === "fare") setStep("location");
    else navigate(-1);
  };

  const selectedV = vehicles.find((v) => v.id === selectedVehicle)!;

  return (
    <MobileLayout hideNav>
      <div className="min-h-screen bg-background relative">
        {/* Full-screen map */}
        <div className="h-screen w-full">
          <MapView
            useGeolocation={step === "location" && !pickupPos}
            interactive={step === "location"}
            onMapClick={handleMapClick}
            pickupPosition={pickupPos || undefined}
            destinationPosition={destPos || undefined}
            showRoute={!!pickupPos && !!destPos}
            nearbyDrivers={nearbyDriverPositions}
            showLocateButton={false}
          />
        </div>

        {/* Top bar */}
        <div className="absolute top-4 left-4 z-[1000]">
          <button onClick={goBack} className="p-2 rounded-xl bg-card border border-border shadow-sm">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        {step === "location" && (
          <div className="absolute top-4 right-4 z-[1000]">
            <div className="bg-card rounded-xl px-3 py-1.5 shadow-sm border border-border text-xs font-semibold text-muted-foreground">
              Tap map to set {pickingField}
            </div>
          </div>
        )}

        {/* Bottom sheet */}
        <RideBottomSheet animationKey={step}>
          {step === "location" && (
            <div className="space-y-4">
              <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    <div className="w-px h-8 bg-border" />
                    <div className="w-3 h-3 bg-accent rounded-sm" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <Input
                      placeholder="Pickup location"
                      value={pickupName}
                      onFocus={() => setPickingField("pickup")}
                      onChange={(e) => setPickupName(e.target.value)}
                      className={cn("border-0 bg-secondary/50 rounded-xl h-11", pickingField === "pickup" && "ring-2 ring-primary")}
                    />
                    <Input
                      placeholder="Where to?"
                      value={destName}
                      onFocus={() => setPickingField("destination")}
                      onChange={(e) => setDestName(e.target.value)}
                      className={cn("border-0 bg-secondary/50 rounded-xl h-11", pickingField === "destination" && "ring-2 ring-accent")}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleUseMyLocation}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <Crosshair className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Use my location</span>
              </button>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs font-bold text-muted-foreground">
                    {geocodeResults.length > 0 ? "SEARCH RESULTS" : "SUGGESTIONS"}
                  </p>
                  {geocodeLoading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                </div>
                {displayResults.map((s, i) => (
                  <button
                    key={`${s.name}-${i}`}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-colors"
                    onClick={() => handleSuggestion(s)}
                  >
                    {geocodeResults.length > 0 ? (
                      <Search className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div className="text-left">
                      <p className="text-sm font-semibold">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.addr}</p>
                    </div>
                  </button>
                ))}
              </div>

              <Button
                onClick={handleConfirmLocation}
                disabled={!canProceedToFare}
                className="w-full h-12 rounded-2xl text-base font-bold"
              >
                Confirm Location
              </Button>
            </div>
          )}

          {step === "fare" && (
            <div className="space-y-4">
              <Card className="p-4 rounded-2xl border-primary/20">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                    <div className="w-px h-5 bg-border" />
                    <div className="w-2.5 h-2.5 bg-accent rounded-sm" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="font-semibold truncate">{pickupName}</p>
                    <p className="font-semibold truncate">{destName}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Navigation className="h-3 w-3" /> ~5.2 km</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~15 min</span>
                </div>
              </Card>

              <div className="space-y-2 max-h-[35vh] overflow-y-auto">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicle(v.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-2xl border transition-all",
                      selectedVehicle === v.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-primary/20"
                    )}
                  >
                    <div className={cn("p-2.5 rounded-xl", selectedVehicle === v.id ? "bg-primary/10" : "bg-secondary")}>
                      <v.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-sm">{v.label}</p>
                      <p className="text-xs text-muted-foreground">{v.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{v.price}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3" /> {v.eta}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <Button onClick={handleSelectVehicle} className="w-full h-12 rounded-2xl text-base font-bold">
                Continue
              </Button>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-bold">Confirm your ride</p>
                <p className="text-sm text-muted-foreground">Review details before booking</p>
              </div>

              <Card className="p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-xl bg-primary/10")}>
                    <selectedV.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{selectedV.label}</p>
                    <p className="text-xs text-muted-foreground">{selectedV.eta} away</p>
                  </div>
                  <p className="text-lg font-bold text-primary">{selectedV.price}</p>
                </div>

                <div className="border-t border-border pt-3 space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full mt-1.5 shrink-0" />
                    <p className="truncate">{pickupName}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2.5 h-2.5 bg-accent rounded-sm mt-1.5 shrink-0" />
                    <p className="truncate">{destName}</p>
                  </div>
                </div>
              </Card>

              <div className="flex items-center gap-3 p-3 bg-card rounded-2xl border border-border">
                {payment === "cash" ? (
                  <Wallet className="h-5 w-5 text-primary" />
                ) : (
                  <CreditCard className="h-5 w-5 text-primary" />
                )}
                <span className="flex-1 text-sm font-semibold">
                  {payment === "cash" ? "Cash" : "Card •••• 4242"}
                </span>
                <button
                  onClick={() => setPayment(payment === "cash" ? "credit_card" : "cash")}
                  className="text-xs text-primary font-bold"
                >
                  Change
                </button>
              </div>

              <Button onClick={handleBook} className="w-full h-12 rounded-2xl text-base font-bold">
                Book {selectedV.label}
              </Button>
            </div>
          )}
        </RideBottomSheet>
      </div>
    </MobileLayout>
  );
}
