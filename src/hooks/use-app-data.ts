import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ─── Promos ─────────────────────────────────────────────────────────────────

export const useActivePromos = () =>
  useQuery({
    queryKey: ["app", "promos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promos")
        .select("*")
        .eq("active", true)
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

// ─── Ride Fare Config ───────────────────────────────────────────────────────

export const useRideFareConfig = () =>
  useQuery({
    queryKey: ["app", "ride_fare_config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ride_fare_config")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

// ─── Trips (Activity) ───────────────────────────────────────────────────────

export const useUserTrips = () =>
  useQuery({
    queryKey: ["app", "trips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

// ─── Shuttle Bookings (Activity) ────────────────────────────────────────────

export const useUserShuttleBookings = () =>
  useQuery({
    queryKey: ["app", "shuttle_bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shuttle_bookings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

// ─── Wallet Transactions ────────────────────────────────────────────────────

export const useWalletTransactions = () =>
  useQuery({
    queryKey: ["app", "transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

// ─── Shuttle Schedules (for user booking) ───────────────────────────────────

export const useShuttleSchedules = () =>
  useQuery({
    queryKey: ["app", "shuttle_schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shuttle_departures")
        .select(`
          *,
          route:shuttle_routes(
            *,
            pickup_points:shuttle_pickup_points(*)
          )
        `)
        .eq("active", true);
      if (error) throw error;
      return data;
    },
  });

export const useShuttleVehicleClasses = () =>
  useQuery({
    queryKey: ["app", "shuttle_vehicle_classes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shuttle_vehicle_classes")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

// ─── App Settings ───────────────────────────────────────────────────────────

export const useAppSetting = (key: string) =>
  useQuery({
    queryKey: ["app", "settings", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", key)
        .single();
      if (error) throw error;
      return data?.value;
    },
  });

// ─── Profile Stats ──────────────────────────────────────────────────────────

export const useProfileStats = () =>
  useQuery({
    queryKey: ["app", "profile_stats"],
    queryFn: async () => {
      const [tripsRes, bookingsRes] = await Promise.all([
        supabase.from("trips").select("id", { count: "exact", head: true }),
        supabase.from("shuttle_bookings").select("id", { count: "exact", head: true }),
      ]);
      return {
        rides: tripsRes.count ?? 0,
        shuttles: bookingsRes.count ?? 0,
      };
    },
  });

// ─── Dashboard Computed Data ────────────────────────────────────────────────

export const useDashboardCharts = () =>
  useQuery({
    queryKey: ["app", "dashboard_charts"],
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const since = sevenDaysAgo.toISOString();

      const [tripsRes, txnRes] = await Promise.all([
        supabase.from("trips").select("created_at, fare").gte("created_at", since),
        supabase.from("transactions").select("created_at, amount, status").gte("created_at", since),
      ]);

      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const tripsByDay: Record<string, number> = {};
      const revenueByDay: Record<string, number> = {};
      days.forEach((d) => { tripsByDay[d] = 0; revenueByDay[d] = 0; });

      (tripsRes.data || []).forEach((t) => {
        const day = days[new Date(t.created_at).getDay()];
        tripsByDay[day]++;
      });

      (txnRes.data || []).filter((t) => t.status === "success").forEach((t) => {
        const day = days[new Date(t.created_at).getDay()];
        revenueByDay[day] += t.amount;
      });

      const tripsChartData = days.map((d) => ({ day: d, trips: tripsByDay[d] }));
      const revenueChartData = days.map((d) => ({ day: d, revenue: revenueByDay[d] }));

      return { tripsChartData, revenueChartData };
    },
  });

export const useRecentActivity = () =>
  useQuery({
    queryKey: ["app", "recent_activity"],
    queryFn: async () => {
      const [tripsRes, txnRes, driversRes, bookingsRes] = await Promise.all([
        supabase.from("trips").select("id, passenger_name, status, created_at").order("created_at", { ascending: false }).limit(3),
        supabase.from("transactions").select("id, description, status, created_at").order("created_at", { ascending: false }).limit(3),
        supabase.from("drivers").select("id, name, joined_at").order("joined_at", { ascending: false }).limit(2),
        (supabase as any).from("shuttle_bookings").select("id, status, created_at").order("created_at", { ascending: false }).limit(2),
      ]);

      const activities: { id: string; text: string; time: string; type: string }[] = [];

      (tripsRes.data || []).forEach((t) => {
        activities.push({
          id: `trip-${t.id}`,
          text: `${t.passenger_name} - trip ${t.id} (${t.status})`,
          time: new Date(t.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
          type: "trip",
        });
      });

      (txnRes.data || []).forEach((t) => {
        activities.push({
          id: `txn-${t.id}`,
          text: `${t.description} - ${t.status}`,
          time: new Date(t.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
          type: "payment",
        });
      });

      (driversRes.data || []).forEach((d) => {
        activities.push({
          id: `driver-${d.id}`,
          text: `Driver ${d.name} terdaftar`,
          time: new Date(d.joined_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
          type: "driver",
        });
      });

      (bookingsRes.data || []).forEach((b: any) => {
        activities.push({
          id: `booking-${b.id}`,
          text: `Booking shuttle ${b.id} (${b.status})`,
          time: new Date(b.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }),
          type: "booking",
        });
      });

      // Sort by time descending (most recent first)
      activities.sort((a, b) => b.time.localeCompare(a.time));
      return activities.slice(0, 10);
    },
  });

// ─── Drivers (for dispatch) ─────────────────────────────────────────────────

export const useOnlineDrivers = () =>
  useQuery({
    queryKey: ["app", "online_drivers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .neq("status", "offline");
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000,
  });
