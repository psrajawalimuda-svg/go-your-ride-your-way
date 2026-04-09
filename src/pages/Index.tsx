import { Navigation, Car, Bike, Truck, Bus, ChevronRight, Star, Clock, Bell } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { MapView } from "@/components/MapView";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";

const vehicleTypes = [
  { id: "bike", icon: Bike, label: "Bike", eta: "3 min", price: "Rp 8K" },
  { id: "car", icon: Car, label: "Car", eta: "5 min", price: "Rp 25K" },
  { id: "premium", icon: Car, label: "Premium", eta: "7 min", price: "Rp 45K" },
  { id: "truck", icon: Truck, label: "Truck", eta: "12 min", price: "Rp 60K" },
];

const recentPlaces = [
  { name: "Office - Sudirman Tower", address: "Jl. Jend. Sudirman No. 52", icon: Clock },
  { name: "Home", address: "Jl. Kemang Raya No. 15", icon: Star },
];

export default function Index() {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

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
            <Button
              variant="outline"
              size="icon"
              className="bg-card rounded-2xl shadow-lg border-none relative h-10 w-10"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
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
              onClick={() => navigate("/ride/book")}
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

          {/* Vehicle quick-select */}
          <div className="grid grid-cols-4 gap-2">
            {vehicleTypes.map((v) => (
              <button
                key={v.id}
                onClick={() => navigate("/ride/book")}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <v.icon className="h-6 w-6 text-foreground" />
                <span className="text-xs font-semibold">{v.label}</span>
                <span className="text-[10px] text-muted-foreground">{v.eta}</span>
              </button>
            ))}
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
      </div>
    </MobileLayout>
  );
}
