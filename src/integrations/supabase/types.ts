export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          category: string
          description: string | null
          id: string
          key: string
          label: string
          updated_at: string
          value: Json
        }
        Insert: {
          category?: string
          description?: string | null
          id?: string
          key: string
          label: string
          updated_at?: string
          value?: Json
        }
        Update: {
          category?: string
          description?: string | null
          id?: string
          key?: string
          label?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      app_users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          role: string
          status: string
          total_trips: number
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          phone: string
          role?: string
          status?: string
          total_trips?: number
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          role?: string
          status?: string
          total_trips?: number
        }
        Relationships: []
      }
      drivers: {
        Row: {
          approved: boolean
          email: string
          id: string
          joined_at: string
          name: string
          phone: string
          rating: number
          status: string
          total_trips: number
          vehicle_class: string
          vehicle_model: string
          vehicle_plate: string
        }
        Insert: {
          approved?: boolean
          email: string
          id: string
          joined_at?: string
          name: string
          phone: string
          rating?: number
          status?: string
          total_trips?: number
          vehicle_class: string
          vehicle_model: string
          vehicle_plate: string
        }
        Update: {
          approved?: boolean
          email?: string
          id?: string
          joined_at?: string
          name?: string
          phone?: string
          rating?: number
          status?: string
          total_trips?: number
          vehicle_class?: string
          vehicle_model?: string
          vehicle_plate?: string
        }
        Relationships: []
      }
      promos: {
        Row: {
          active: boolean
          badge: string | null
          end_date: string
          gradient: string
          id: string
          start_date: string
          subtitle: string
          title: string
        }
        Insert: {
          active?: boolean
          badge?: string | null
          end_date: string
          gradient?: string
          id?: string
          start_date: string
          subtitle: string
          title: string
        }
        Update: {
          active?: boolean
          badge?: string | null
          end_date?: string
          gradient?: string
          id?: string
          start_date?: string
          subtitle?: string
          title?: string
        }
        Relationships: []
      }
      shuttle_bookings: {
        Row: {
          created_at: string
          departure: string
          id: string
          passenger_name: string
          route: string
          seats: number
          status: string
          total_price: number
        }
        Insert: {
          created_at?: string
          departure: string
          id: string
          passenger_name: string
          route: string
          seats?: number
          status?: string
          total_price: number
        }
        Update: {
          created_at?: string
          departure?: string
          id?: string
          passenger_name?: string
          route?: string
          seats?: number
          status?: string
          total_price?: number
        }
        Relationships: []
      }
      shuttle_departures: {
        Row: {
          active: boolean
          arrival_time: string
          batch_label: string
          created_at: string
          departure_time: string
          driver_count: number
          id: string
          route_id: string
        }
        Insert: {
          active?: boolean
          arrival_time: string
          batch_label: string
          created_at?: string
          departure_time: string
          driver_count?: number
          id?: string
          route_id: string
        }
        Update: {
          active?: boolean
          arrival_time?: string
          batch_label?: string
          created_at?: string
          departure_time?: string
          driver_count?: number
          id?: string
          route_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shuttle_departures_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "shuttle_routes"
            referencedColumns: ["id"]
          },
        ]
      }
      shuttle_pickup_points: {
        Row: {
          created_at: string
          distance_m: number
          id: string
          name: string
          pickup_time: string
          route_id: string
          sequence: number
        }
        Insert: {
          created_at?: string
          distance_m?: number
          id?: string
          name: string
          pickup_time: string
          route_id: string
          sequence: number
        }
        Update: {
          created_at?: string
          distance_m?: number
          id?: string
          name?: string
          pickup_time?: string
          route_id?: string
          sequence?: number
        }
        Relationships: [
          {
            foreignKeyName: "shuttle_pickup_points_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "shuttle_routes"
            referencedColumns: ["id"]
          },
        ]
      }
      shuttle_routes: {
        Row: {
          code: string
          created_at: string
          from_city: string
          id: string
          name: string
          to_city: string
          total_distance_m: number
        }
        Insert: {
          code: string
          created_at?: string
          from_city: string
          id?: string
          name: string
          to_city: string
          total_distance_m?: number
        }
        Update: {
          code?: string
          created_at?: string
          from_city?: string
          id?: string
          name?: string
          to_city?: string
          total_distance_m?: number
        }
        Relationships: []
      }
      shuttle_schedules: {
        Row: {
          arrival: string
          available_seats: number
          departure: string
          duration: string
          from_city: string
          id: string
          operator: string
          price: number
          to_city: string
          total_seats: number
        }
        Insert: {
          arrival: string
          available_seats: number
          departure: string
          duration: string
          from_city: string
          id: string
          operator: string
          price: number
          to_city: string
          total_seats: number
        }
        Update: {
          arrival?: string
          available_seats?: number
          departure?: string
          duration?: string
          from_city?: string
          id?: string
          operator?: string
          price?: number
          to_city?: string
          total_seats?: number
        }
        Relationships: []
      }
      shuttle_vehicle_classes: {
        Row: {
          baggage_rules: Json
          created_at: string
          id: string
          name: string
          price_per_km: number
          seating_layouts: Json
          sort_order: number
        }
        Insert: {
          baggage_rules?: Json
          created_at?: string
          id?: string
          name: string
          price_per_km: number
          seating_layouts?: Json
          sort_order?: number
        }
        Update: {
          baggage_rules?: Json
          created_at?: string
          id?: string
          name?: string
          price_per_km?: number
          seating_layouts?: Json
          sort_order?: number
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          method: string
          related_to: string
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id: string
          method: string
          related_to?: string
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          method?: string
          related_to?: string
          status?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          created_at: string
          distance: string
          driver_name: string
          dropoff: string
          fare: number
          id: string
          passenger_name: string
          pickup: string
          status: string
          vehicle_class: string
        }
        Insert: {
          created_at?: string
          distance?: string
          driver_name: string
          dropoff: string
          fare?: number
          id: string
          passenger_name: string
          pickup: string
          status?: string
          vehicle_class: string
        }
        Update: {
          created_at?: string
          distance?: string
          driver_name?: string
          dropoff?: string
          fare?: number
          id?: string
          passenger_name?: string
          pickup?: string
          status?: string
          vehicle_class?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
