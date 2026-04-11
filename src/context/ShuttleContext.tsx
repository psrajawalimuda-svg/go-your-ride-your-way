import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Booking, ShuttleSchedule, ShuttlePassenger, BookingStatus } from "@/types/models";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface ShuttleContextType {
  bookings: Booking[];
  activeBooking: Booking | null;
  createBooking: (data: {
    departureId: string;
    vehicleClassId: string;
    pickupPointId: string;
    seats: number[];
    passengers: ShuttlePassenger[];
    totalPrice: number;
  }) => Promise<string | null>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  setPaymentRef: (bookingId: string, paymentId: string) => Promise<void>;
  getBooking: (id: string) => Promise<Booking | null>;
}

const ShuttleContext = createContext<ShuttleContextType | null>(null);

export function ShuttleProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const { user } = useAuth();

  const createBooking = useCallback(
    async (data: { 
      departureId: string; 
      vehicleClassId: string; 
      pickupPointId: string; 
      seats: number[]; 
      passengers: ShuttlePassenger[]; 
      totalPrice: number 
    }) => {
      if (!user) {
        toast.error("Please log in to book a shuttle");
        return null;
      }

      try {
        const { data: bookingId, error } = await (supabase as any).rpc("create_shuttle_booking", {
          p_user_id: user.id,
          p_departure_id: data.departureId,
          p_vehicle_class_id: data.vehicleClassId,
          p_pickup_point_id: data.pickupPointId,
          p_total_price: data.totalPrice,
          p_passengers: data.passengers.map((p, i) => ({
            ...p,
            seat_number: data.seats[i]
          }))
        });

        if (error) throw error;

        toast.success("Shuttle booking created!");
        return bookingId;
      } catch (error: any) {
        console.error("Booking error:", error);
        toast.error(error.message || "Failed to create booking");
        return null;
      }
    },
    [user]
  );

  const updateBookingStatus = useCallback(async (id: string, status: BookingStatus) => {
     try {
       const { error } = await (supabase as any)
         .from("shuttle_bookings")
         .update({ status, updated_at: new Date().toISOString() })
         .eq("id", id);
       
       if (error) throw error;
      
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      if (activeBooking?.id === id) {
        setActiveBooking({ ...activeBooking, status });
      }
    } catch (error: any) {
      toast.error("Failed to update booking status");
    }
  }, [activeBooking]);

  const setPaymentRef = useCallback(async (bookingId: string, paymentId: string) => {
     try {
       const { error } = await (supabase as any)
         .from("shuttle_bookings")
         .update({ payment_id: paymentId, updated_at: new Date().toISOString() })
         .eq("id", bookingId);
       
       if (error) throw error;
      
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, paymentId } : b)));
    } catch (error: any) {
      console.error("Payment ref error:", error);
    }
  }, []);

  const getBooking = useCallback(async (id: string) => {
     try {
       const { data, error } = await (supabase as any)
         .from("shuttle_bookings")
         .select(`
           *,
           passengers:shuttle_booking_passengers(*),
           departure:shuttle_departures(
             *,
             route:shuttle_routes(*)
           )
         `)
         .eq("id", id)
         .single();
       
       if (error) throw error;
      return data as any;
    } catch (error) {
      return null;
    }
  }, []);

  return (
    <ShuttleContext.Provider value={{ bookings, activeBooking, createBooking, updateBookingStatus, setPaymentRef, getBooking }}>
      {children}
    </ShuttleContext.Provider>
  );
}

export function useShuttle() {
  const ctx = useContext(ShuttleContext);
  if (!ctx) throw new Error("useShuttle must be used within ShuttleProvider");
  return ctx;
}
