import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export interface DriverApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  license_number: string;
  license_expiry: string;
  vehicle_type: string;
  vehicle_model: string;
  vehicle_plate: string;
  vehicle_year: number;
  ktp_url: string;
  stnk_url: string;
  license_url: string;
  vehicle_photo_url: string;
  status: "pending" | "approved" | "rejected";
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

// ─── Query Hooks ────────────────────────────────────────────────────────────

export const useAdminUsers = () =>
  useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("app_users").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useAdminDrivers = () =>
  useQuery({
    queryKey: ["admin", "drivers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("drivers").select("*").order("joined_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useAdminTrips = () =>
  useQuery({
    queryKey: ["admin", "trips"],
    queryFn: async () => {
      const { data, error } = await supabase.from("trips").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useAdminShuttleSchedules = () =>
  useQuery({
    queryKey: ["admin", "shuttle_schedules"],
    queryFn: async () => {
      const { data, error } = await supabase.from("shuttle_schedules").select("*");
      if (error) throw error;
      return data;
    },
  });

export const useAdminShuttleBookings = () =>
  useQuery({
    queryKey: ["admin", "shuttle_bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("shuttle_bookings").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

// ─── Shuttle Management Hooks ───────────────────────────────────────────────

export const useShuttleRoutes = () =>
  useQuery({
    queryKey: ["admin", "shuttle_routes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shuttle_routes")
        .select("*")
        .order("code");
      if (error) throw error;
      return data;
    },
  });

export const useShuttlePickupPoints = (routeId?: string) =>
  useQuery({
    queryKey: ["admin", "shuttle_pickup_points", routeId],
    queryFn: async () => {
      let q = supabase.from("shuttle_pickup_points").select("*").order("sequence");
      if (routeId) q = q.eq("route_id", routeId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
    enabled: routeId !== undefined,
  });

export const useAllShuttlePickupPoints = () =>
  useQuery({
    queryKey: ["admin", "shuttle_pickup_points", "all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("shuttle_pickup_points").select("*").order("sequence");
      if (error) throw error;
      return data;
    },
  });

export const useShuttleVehicleClasses = () =>
  useQuery({
    queryKey: ["admin", "shuttle_vehicle_classes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("shuttle_vehicle_classes").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

export const useShuttleDepartures = () =>
  useQuery({
    queryKey: ["admin", "shuttle_departures"],
    queryFn: async () => {
      const { data, error } = await supabase.from("shuttle_departures").select("*").order("departure_time");
      if (error) throw error;
      return data;
    },
  });

export const useUpsertPickupPoint = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (point: { id?: string; route_id: string; sequence: number; name: string; pickup_time: string; distance_m: number }) => {
      const { error } = await supabase.from("shuttle_pickup_points").upsert(point as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "shuttle_pickup_points"] }),
  });
};

export const useDeletePickupPoint = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("shuttle_pickup_points").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "shuttle_pickup_points"] }),
  });
};

export const useUpdateVehicleClass = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; price_per_km?: number; baggage_rules?: any }) => {
      const { error } = await supabase.from("shuttle_vehicle_classes").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "shuttle_vehicle_classes"] }),
  });
};

export const useUpsertDeparture = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dep: { id?: string; batch_label: string; departure_time: string; arrival_time: string; route_id: string; driver_count: number; active: boolean }) => {
      const { error } = await supabase.from("shuttle_departures").upsert(dep as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "shuttle_departures"] }),
  });
};

export const useDeleteDeparture = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("shuttle_departures").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "shuttle_departures"] }),
  });
};

export const useAdminTransactions = () =>
  useQuery({
    queryKey: ["admin", "transactions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("transactions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useAdminDriverApplications = () =>
  useQuery({
    queryKey: ["admin", "driver_applications"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("driver_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as DriverApplication[];
    },
  });

export const useAdminPromos = () =>
  useQuery({
    queryKey: ["admin", "promos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("promos").select("*");
      if (error) throw error;
      return data;
    },
  });

// ─── Mutation Hooks ─────────────────────────────────────────────────────────

export const useUpdateUserStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("app_users").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
};

export const useUpdateDriverApproval = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const { error } = await supabase.from("drivers").update({ approved }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "drivers"] }),
  });
};

export const useReviewDriverApplication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, admin_notes }: { id: string; status: "approved" | "rejected"; admin_notes?: string }) => {
      // 1. Update application status
      const { data, error: appError } = await (supabase as any)
        .from("driver_applications")
        .update({ status, admin_notes, updated_at: new Date().toISOString() } as any)
        .eq("id", id)
        .select()
        .single();
      
      if (appError) throw appError;
      const app = data as unknown as DriverApplication;

      // 2. If approved, create/update entry in drivers table
      if (status === "approved" && app) {
        const { error: driverError } = await supabase.from("drivers").upsert({
          id: app.user_id,
          name: app.full_name,
          email: app.email,
          phone: app.phone,
          vehicle_class: app.vehicle_type,
          vehicle_plate: app.vehicle_plate,
          vehicle_model: app.vehicle_model,
          approved: true,
          status: "offline",
          joined_at: new Date().toISOString()
        });
        
        if (driverError) throw driverError;

        // 3. Update user role to driver
        const { error: userError } = await supabase
          .from("app_users")
          .update({ role: "driver" })
          .eq("id", app.user_id);
          
        if (userError) throw userError;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "driver_applications"] });
      qc.invalidateQueries({ queryKey: ["admin", "drivers"] });
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
};

export const useUpsertPromo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (promo: Tables<"promos">) => {
      const { error } = await supabase.from("promos").upsert(promo);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "promos"] }),
  });
};

export const useDeletePromo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("promos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "promos"] }),
  });
};

export const useUpdatePromoActive = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("promos").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "promos"] }),
  });
};

// ─── Settings ───────────────────────────────────────────────────────────────

export const useAdminSettings = () =>
  useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("app_settings").select("*").order("key");
      if (error) throw error;
      return data;
    },
  });

export const useUpdateSetting = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase.from("app_settings").update({ value, updated_at: new Date().toISOString() }).eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "settings"] }),
  });
};
