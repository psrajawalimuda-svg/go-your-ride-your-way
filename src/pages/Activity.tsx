import { Car, Bus, MapPin, Clock, ChevronRight } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUserTrips, useUserShuttleBookings } from "@/hooks/use-app-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function Activity() {
  const { data: dbTrips, isLoading: tripsLoading } = useUserTrips();
  const { data: dbBookings, isLoading: bookingsLoading } = useUserShuttleBookings();

  const isLoading = tripsLoading || bookingsLoading;

  const trips = [
    ...(dbTrips || []).map((t) => ({
      id: t.id,
      type: "ride" as const,
      from: t.pickup,
      to: t.dropoff,
      date: new Date(t.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      price: `Rp ${t.fare.toLocaleString("id-ID")}`,
      status: t.status,
    })),
    ...(dbBookings || []).map((b) => ({
      id: b.id,
      type: "shuttle" as const,
      from: b.route.split("→")[0]?.trim() || b.route,
      to: b.route.split("→")[1]?.trim() || "",
      date: new Date(b.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      price: `Rp ${b.total_price.toLocaleString("id-ID")}`,
      status: b.status,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <MobileLayout>
      <div className="px-4 pt-6 space-y-4">
        <h1 className="text-2xl font-extrabold">Activity</h1>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
          </div>
        ) : trips.length === 0 ? (
          <Card className="p-8 rounded-2xl text-center">
            <p className="text-sm text-muted-foreground">No activity yet</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {trips.map((trip, i) => (
              <motion.div key={trip.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="p-4 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2.5 rounded-xl",
                      trip.type === "ride" ? "bg-primary/10" : "bg-accent/10"
                    )}>
                      {trip.type === "ride" ? (
                        <Car className="h-5 w-5 text-primary" />
                      ) : (
                        <Bus className="h-5 w-5 text-accent" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm">{trip.type === "ride" ? "PYU Ride" : "PYU Shuttle"}</p>
                        <span className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full",
                          trip.status === "completed" ? "bg-primary/10 text-primary" : 
                          trip.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                          "bg-amber-500/10 text-amber-600"
                        )}>
                          {trip.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {trip.date}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2 text-xs">
                        <MapPin className="h-3 w-3 text-primary shrink-0" />
                        <span className="truncate">{trip.from}</span>
                        <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate">{trip.to}</span>
                      </div>
                    </div>
                    <p className="font-bold text-sm whitespace-nowrap">{trip.price}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
