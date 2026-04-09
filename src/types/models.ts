// ─── Core Domain Models ─────────────────────────────────────────────────────

export type UserRole = "passenger" | "driver" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
}

export type VehicleClass = "bike" | "car" | "premium" | "truck";

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  color: string;
  class: VehicleClass;
}

export type DriverStatus = "offline" | "online" | "busy";

export interface Driver extends User {
  role: "driver";
  vehicle: Vehicle;
  status: DriverStatus;
  rating: number;
  totalTrips: number;
  location: LatLng | null;
}

export type LatLng = [number, number];

// ─── Trip (Ride) ────────────────────────────────────────────────────────────

export type TripStatus =
  | "idle"
  | "searching"
  | "found"
  | "arriving"
  | "on_trip"
  | "completed"
  | "cancelled"
  | "timeout";

export interface TripLocation {
  label: string;
  coords: LatLng | null;
}

export interface Trip {
  id: string;
  passengerId: string;
  driverId?: string;
  pickup: TripLocation;
  dropoff: TripLocation;
  vehicleClass: VehicleClass;
  status: TripStatus;
  fare: number;
  distance?: string;
  duration?: string;
  paymentMethod: PaymentMethodType;
  createdAt: string;
  completedAt?: string;
}

// ─── Shuttle Booking ────────────────────────────────────────────────────────

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface ShuttleSchedule {
  id: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  operator: string;
  totalSeats: number;
  availableSeats: number;
}

export interface ShuttlePassenger {
  name: string;
  phone: string;
  email: string;
}

export interface Booking {
  id: string;
  userId: string;
  schedule: ShuttleSchedule;
  seats: number[];
  passengers: ShuttlePassenger[];
  status: BookingStatus;
  totalPrice: number;
  paymentId?: string;
  createdAt: string;
}

// ─── Route ──────────────────────────────────────────────────────────────────

export interface RouteInfo {
  origin: TripLocation;
  destination: TripLocation;
  waypoints?: TripLocation[];
  distance: string;
  duration: string;
  polyline?: LatLng[];
}

// ─── Payment ────────────────────────────────────────────────────────────────

export type PaymentMethodType =
  | "cash"
  | "wallet"
  | "bank_transfer"
  | "ewallet"
  | "credit_card"
  | "qris";

export type TransactionStatus = "pending" | "processing" | "success" | "failed";

export interface Payment {
  id: string;
  amount: number;
  method: PaymentMethodType;
  status: TransactionStatus;
  description: string;
  transactionRef?: string;
  createdAt: string;
  completedAt?: string;
}

// ─── Notifications ──────────────────────────────────────────────────────────

export type NotificationType =
  | "driver_found"
  | "trip_started"
  | "trip_completed"
  | "payment_success"
  | "shuttle_reminder"
  | "system";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  isPush: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface NotificationPreference {
  userId: string;
  pushEnabled: boolean;
  types: Record<NotificationType, boolean>;
}
