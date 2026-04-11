import { useState } from "react";
import { Navigation, Car, Bike, Bus, ChevronRight, Star, Clock, Plane, Building2, X } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { MapView } from "@/components/MapView";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRide } from "@/context/RideContext";

const serviceOptions = [
  { id: "bike", icon: Bike, label: "Bike", color: "bg-blue-100" },
  { id: "womenbike", icon: Bike, label: "Women Bike", color: "bg-pink-100" },
  { id: "car", icon: Car, label: "Car", color: "bg-green-100" },
  { id: "airport", icon: Plane, label: "Airport", color: "bg-purple-100" },
  { id: "hotel", icon: Building2, label: "Hotel", color: "bg-orange-100" },
];

const vehicleTypes = [
  { id: "bike", icon: Bike, label: "Bike", eta: "3 min", price: "Rp 8K" },
  { id: "car", icon: Car, label: "Car", eta: "5 min", price: "Rp 25K" },
  { id: "premium", icon: Car, label: "Premium", eta: "7 min", price: "Rp 45K" },
  { id: "womenbike", icon: Bike, label: "Women Bike", eta: "5 min", price: "Rp 15K" },
];

const recentPlaces = [
  { name: "Office - Sudirman Tower", address: "Jl. Jend. Sudirman No. 52", icon: Clock },
  { name: "Home", address: "Jl. Kemang Raya No. 15", icon: Star },
];

export default function Index() {
  const navigate = useNavigate();
  const { ride, setRide } = useRide();
  const [showRideNowServices, setShowRideNowServices] = useState(false);

  const handleSelectService = (service: string) => {
    setRide({ ...ride, vehicle: service as any });
    setShowRideNowServices(false);
    navigate("/ride/book");
  };

  const handleSelectVehicle = (vehicleId: string) => {
    setRide({ ...ride, vehicle: vehicleId as any });
    navigate("/ride/book");
  };

  return (
    <MobileLayout>
      <div className="relative">
        {/* Map header */}
        <div className="h-[38vh] relative overflow-hidden">
          <MapView useGeolocation showLocateButton />
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-[1000]">
            <div className="bg-card rounded-2xl px-4 py-2 shadow-lg">
              <span className="text-lg font-extrabold text-primary">PYU</span>
              <span className="text-lg font-extrabold text-accent">GO</span>
            </div>
          </div>
        </div>

        {/* Bottom sheet */}
        <div className="relative -mt-6 rounded-t-3xl bg-background px-4 pt-5 pb-4 space-y-5 z-10">
          <div className="w-10 h-1 rounded-full bg-border mx-auto" />

          {/* Search bar */}
          <button
            onClick={() => navigate("/ride/book")}
            className="w-full flex items-center gap-3 bg-card rounded-2xl p-4 shadow-sm border border-border hover:border-primary/30 transition-colors"
          >
            <div className="p-2 bg-primary/10 rounded-xl">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <span className="text-muted-foreground font-medium flex-1 text-left">
              Where are you going?
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Two main entry cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card
              className="p-4 rounded-2xl cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => setShowRideNowServices(true)}
            >
              <div className="p-3 bg-primary/10 rounded-xl w-fit mb-3">
                <Car className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-extrabold text-sm">Ride Now</h3>
              <p className="text-xs text-muted-foreground mt-1">On-demand rides nearby</p>
            </Card>
            <Card
              className="p-4 rounded-2xl cursor-pointer hover:border-accent/30 transition-colors relative"
              onClick={() => navigate("/shuttle")}
            >
              <Badge variant="secondary" className="absolute top-3 right-3 text-[9px] font-bold">
                Guest OK
              </Badge>
              <div className="p-3 bg-accent/10 rounded-xl w-fit mb-3">
                <Bus className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-extrabold text-sm">Shuttle</h3>
              <p className="text-xs text-muted-foreground mt-1">Intercity trips</p>
            </Card>
          </div>

          {/* Recent places */}
          <div>
            <h3 className="text-sm font-bold mb-2">Recent Places</h3>
            <div className="space-y-1">
              {recentPlaces.map((place) => (
                <button
                  key={place.name}
                  onClick={() => navigate("/ride/book")}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-colors"
                >
                  <div className="p-2 bg-secondary rounded-lg">
                    <place.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold">{place.name}</p>
                    <p className="text-xs text-muted-foreground">{place.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Service Selection Modal */}
        {showRideNowServices && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-end animate-in fade-in">
            <div className="w-full bg-background rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold">Select Service</h2>
                <button
                  onClick={() => setShowRideNowServices(false)}
                  className="p-1 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {serviceOptions.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleSelectService(service.id)}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-95"
                  >
                    <div className={`p-3 rounded-xl ${service.color}`}>
                      <service.icon className="h-6 w-6 text-foreground" />
                    </div>
                    <span className="text-xs font-semibold text-center">{service.label}</span>
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowRideNowServices(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
