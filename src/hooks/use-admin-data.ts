import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

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

export const useAdminTransactions = () =>
  useQuery({
    queryKey: ["admin", "transactions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("transactions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
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
