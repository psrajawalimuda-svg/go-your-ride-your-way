import type { VehicleClass, DriverStatus, TripStatus, PaymentMethodType, TransactionStatus, BookingStatus } from "@/types/models";

// ─── Users ──────────────────────────────────────────────────────────────────
export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "passenger" | "driver" | "admin";
  status: "active" | "suspended";
  createdAt: string;
  totalTrips: number;
}

export const mockUsers: MockUser[] = [
  { id: "u1", name: "Andi Pratama", email: "andi@mail.com", phone: "+62812345001", role: "passenger", status: "active", createdAt: "2025-11-01", totalTrips: 24 },
  { id: "u2", name: "Siti Nurhaliza", email: "siti@mail.com", phone: "+62812345002", role: "passenger", status: "active", createdAt: "2025-10-15", totalTrips: 52 },
  { id: "u3", name: "Budi Santoso", email: "budi@mail.com", phone: "+62812345003", role: "passenger", status: "suspended", createdAt: "2025-09-20", totalTrips: 8 },
  { id: "u4", name: "Dewi Anggraini", email: "dewi@mail.com", phone: "+62812345004", role: "passenger", status: "active", createdAt: "2025-12-01", totalTrips: 17 },
  { id: "u5", name: "Rizky Fauzan", email: "rizky@mail.com", phone: "+62812345005", role: "passenger", status: "active", createdAt: "2026-01-10", totalTrips: 35 },
  { id: "u6", name: "Maya Putri", email: "maya@mail.com", phone: "+62812345006", role: "passenger", status: "active", createdAt: "2026-02-14", totalTrips: 12 },
  { id: "u7", name: "Hendra Wijaya", email: "hendra@mail.com", phone: "+62812345007", role: "passenger", status: "active", createdAt: "2026-01-25", totalTrips: 41 },
  { id: "u8", name: "Lina Marlina", email: "lina@mail.com", phone: "+62812345008", role: "passenger", status: "suspended", createdAt: "2025-08-10", totalTrips: 3 },
];

// ─── Drivers ────────────────────────────────────────────────────────────────
export interface MockDriver {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleClass: VehicleClass;
  vehiclePlate: string;
  vehicleModel: string;
  status: DriverStatus;
  rating: number;
  totalTrips: number;
  approved: boolean;
  joinedAt: string;
}

export const mockDrivers: MockDriver[] = [
  { id: "d1", name: "Pak Joko", email: "joko@driver.com", phone: "+62813001001", vehicleClass: "car", vehiclePlate: "B 1234 ABC", vehicleModel: "Toyota Avanza", status: "online", rating: 4.8, totalTrips: 1205, approved: true, joinedAt: "2024-06-01" },
  { id: "d2", name: "Mas Agus", email: "agus@driver.com", phone: "+62813001002", vehicleClass: "bike", vehiclePlate: "B 5678 DEF", vehicleModel: "Honda Vario", status: "busy", rating: 4.6, totalTrips: 892, approved: true, joinedAt: "2024-08-15" },
  { id: "d3", name: "Bang Rudi", email: "rudi@driver.com", phone: "+62813001003", vehicleClass: "premium", vehiclePlate: "B 9012 GHI", vehicleModel: "Toyota Camry", status: "offline", rating: 4.9, totalTrips: 567, approved: true, joinedAt: "2025-01-10" },
  { id: "d4", name: "Kang Dedi", email: "dedi@driver.com", phone: "+62813001004", vehicleClass: "bike", vehiclePlate: "B 3456 JKL", vehicleModel: "Yamaha NMAX", status: "online", rating: 4.5, totalTrips: 340, approved: true, joinedAt: "2025-03-20" },
  { id: "d5", name: "Mbak Rina", email: "rina@driver.com", phone: "+62813001005", vehicleClass: "womenbike", vehiclePlate: "B 7890 MNO", vehicleModel: "Honda Beat", status: "online", rating: 4.7, totalTrips: 215, approved: true, joinedAt: "2025-05-01" },
  { id: "d6", name: "Pak Surya", email: "surya@driver.com", phone: "+62813001006", vehicleClass: "car", vehiclePlate: "B 2345 PQR", vehicleModel: "Daihatsu Xenia", status: "offline", rating: 4.3, totalTrips: 78, approved: false, joinedAt: "2026-03-01" },
];

// ─── Trips ──────────────────────────────────────────────────────────────────
export interface MockTrip {
  id: string;
  passengerName: string;
  driverName: string;
  pickup: string;
  dropoff: string;
  vehicleClass: VehicleClass;
  status: TripStatus;
  fare: number;
  distance: string;
  createdAt: string;
}

export const mockTrips: MockTrip[] = [
  { id: "TRP-001", passengerName: "Andi Pratama", driverName: "Pak Joko", pickup: "Jl. Sudirman No. 10", dropoff: "Mall Grand Indonesia", vehicleClass: "car", status: "completed", fare: 35000, distance: "5.2 km", createdAt: "2026-04-11 08:30" },
  { id: "TRP-002", passengerName: "Siti Nurhaliza", driverName: "Mas Agus", pickup: "Stasiun Gambir", dropoff: "Jl. Thamrin No. 5", vehicleClass: "bike", status: "completed", fare: 12000, distance: "2.1 km", createdAt: "2026-04-11 09:15" },
  { id: "TRP-003", passengerName: "Dewi Anggraini", driverName: "Bang Rudi", pickup: "Hotel Mulia", dropoff: "Bandara Soekarno-Hatta", vehicleClass: "premium", status: "on_trip", fare: 185000, distance: "32 km", createdAt: "2026-04-11 10:00" },
  { id: "TRP-004", passengerName: "Rizky Fauzan", driverName: "Kang Dedi", pickup: "Universitas Indonesia", dropoff: "Blok M Plaza", vehicleClass: "bike", status: "completed", fare: 18000, distance: "8.5 km", createdAt: "2026-04-10 14:20" },
  { id: "TRP-005", passengerName: "Maya Putri", driverName: "Mbak Rina", pickup: "Jl. Kemang Raya", dropoff: "SCBD", vehicleClass: "womenbike", status: "cancelled", fare: 0, distance: "6.1 km", createdAt: "2026-04-10 16:45" },
  { id: "TRP-006", passengerName: "Hendra Wijaya", driverName: "Pak Joko", pickup: "Jl. Gatot Subroto", dropoff: "Monas", vehicleClass: "car", status: "completed", fare: 28000, distance: "4.3 km", createdAt: "2026-04-09 11:00" },
  { id: "TRP-007", passengerName: "Andi Pratama", driverName: "Mas Agus", pickup: "Tanah Abang", dropoff: "Kota Tua", vehicleClass: "bike", status: "completed", fare: 15000, distance: "3.8 km", createdAt: "2026-04-09 13:30" },
  { id: "TRP-008", passengerName: "Lina Marlina", driverName: "Pak Surya", pickup: "Jl. Rasuna Said", dropoff: "Jl. HR Rasuna Said", vehicleClass: "car", status: "cancelled", fare: 0, distance: "1.2 km", createdAt: "2026-04-08 09:00" },
];

// ─── Shuttle Bookings ───────────────────────────────────────────────────────
export interface MockShuttleBooking {
  id: string;
  passengerName: string;
  route: string;
  departure: string;
  seats: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export const mockShuttleSchedules = [
  { id: "s1", from: "Jakarta", to: "Bandung", departure: "06:00", arrival: "09:00", duration: "3h", price: 85000, operator: "Pyugo Shuttle", totalSeats: 20, availableSeats: 8 },
  { id: "s2", from: "Jakarta", to: "Semarang", departure: "07:00", arrival: "13:00", duration: "6h", price: 150000, operator: "Pyugo Express", totalSeats: 30, availableSeats: 15 },
  { id: "s3", from: "Bandung", to: "Jakarta", departure: "14:00", arrival: "17:00", duration: "3h", price: 85000, operator: "Pyugo Shuttle", totalSeats: 20, availableSeats: 3 },
  { id: "s4", from: "Jakarta", to: "Yogyakarta", departure: "20:00", arrival: "06:00", duration: "10h", price: 250000, operator: "Pyugo Night", totalSeats: 25, availableSeats: 20 },
];

export const mockShuttleBookings: MockShuttleBooking[] = [
  { id: "SB-001", passengerName: "Andi Pratama", route: "Jakarta → Bandung", departure: "2026-04-12 06:00", seats: 2, totalPrice: 170000, status: "confirmed", createdAt: "2026-04-10" },
  { id: "SB-002", passengerName: "Siti Nurhaliza", route: "Jakarta → Semarang", departure: "2026-04-13 07:00", seats: 1, totalPrice: 150000, status: "pending", createdAt: "2026-04-11" },
  { id: "SB-003", passengerName: "Hendra Wijaya", route: "Bandung → Jakarta", departure: "2026-04-11 14:00", seats: 3, totalPrice: 255000, status: "completed", createdAt: "2026-04-09" },
  { id: "SB-004", passengerName: "Dewi Anggraini", route: "Jakarta → Yogyakarta", departure: "2026-04-14 20:00", seats: 1, totalPrice: 250000, status: "confirmed", createdAt: "2026-04-11" },
  { id: "SB-005", passengerName: "Maya Putri", route: "Jakarta → Bandung", departure: "2026-04-11 06:00", seats: 1, totalPrice: 85000, status: "cancelled", createdAt: "2026-04-08" },
];

// ─── Payments / Transactions ────────────────────────────────────────────────
export interface MockTransaction {
  id: string;
  description: string;
  amount: number;
  method: PaymentMethodType;
  status: TransactionStatus;
  relatedTo: string;
  createdAt: string;
}

export const mockTransactions: MockTransaction[] = [
  { id: "TXN-001", description: "Ride: TRP-001", amount: 35000, method: "ewallet", status: "success", relatedTo: "TRP-001", createdAt: "2026-04-11 08:45" },
  { id: "TXN-002", description: "Ride: TRP-002", amount: 12000, method: "cash", status: "success", relatedTo: "TRP-002", createdAt: "2026-04-11 09:30" },
  { id: "TXN-003", description: "Ride: TRP-003", amount: 185000, method: "credit_card", status: "pending", relatedTo: "TRP-003", createdAt: "2026-04-11 10:05" },
  { id: "TXN-004", description: "Ride: TRP-004", amount: 18000, method: "wallet", status: "success", relatedTo: "TRP-004", createdAt: "2026-04-10 14:35" },
  { id: "TXN-005", description: "Shuttle: SB-001", amount: 170000, method: "bank_transfer", status: "success", relatedTo: "SB-001", createdAt: "2026-04-10 12:00" },
  { id: "TXN-006", description: "Shuttle: SB-002", amount: 150000, method: "qris", status: "pending", relatedTo: "SB-002", createdAt: "2026-04-11 08:00" },
  { id: "TXN-007", description: "Ride: TRP-006", amount: 28000, method: "ewallet", status: "success", relatedTo: "TRP-006", createdAt: "2026-04-09 11:20" },
  { id: "TXN-008", description: "Ride: TRP-007", amount: 15000, method: "cash", status: "success", relatedTo: "TRP-007", createdAt: "2026-04-09 13:45" },
  { id: "TXN-009", description: "Shuttle: SB-003", amount: 255000, method: "ewallet", status: "success", relatedTo: "SB-003", createdAt: "2026-04-09 10:00" },
  { id: "TXN-010", description: "Shuttle: SB-004", amount: 250000, method: "bank_transfer", status: "processing", relatedTo: "SB-004", createdAt: "2026-04-11 09:00" },
];

// ─── Promos ─────────────────────────────────────────────────────────────────
export interface MockPromo {
  id: string;
  title: string;
  subtitle: string;
  gradient: string;
  badge?: string;
  active: boolean;
  startDate: string;
  endDate: string;
}

export const mockPromos: MockPromo[] = [
  { id: "p1", title: "Diskon 50% Ride Pertama", subtitle: "Khusus pengguna baru", gradient: "from-emerald-500 to-teal-600", badge: "NEW USER", active: true, startDate: "2026-04-01", endDate: "2026-04-30" },
  { id: "p2", title: "Cashback 20% Shuttle", subtitle: "Min. transaksi Rp 100.000", gradient: "from-blue-500 to-indigo-600", badge: "CASHBACK", active: true, startDate: "2026-04-01", endDate: "2026-05-15" },
  { id: "p3", title: "Gratis Ongkir Premium", subtitle: "Setiap hari Jumat", gradient: "from-amber-500 to-orange-600", badge: "FRIDAY", active: true, startDate: "2026-03-15", endDate: "2026-06-30" },
  { id: "p4", title: "Voucher Rp 25.000", subtitle: "Gunakan kode: PYUGO25", gradient: "from-pink-500 to-rose-600", badge: "VOUCHER", active: false, startDate: "2026-02-01", endDate: "2026-03-31" },
];

// ─── Dashboard KPIs ─────────────────────────────────────────────────────────
export const dashboardKPIs = {
  totalUsers: mockUsers.length,
  activeDrivers: mockDrivers.filter(d => d.status !== "offline").length,
  todaysTrips: mockTrips.filter(t => t.createdAt.startsWith("2026-04-11")).length,
  totalRevenue: mockTransactions.filter(t => t.status === "success").reduce((s, t) => s + t.amount, 0),
  pendingPayments: mockTransactions.filter(t => t.status === "pending" || t.status === "processing").length,
};

export const tripsChartData = [
  { day: "Mon", trips: 42 },
  { day: "Tue", trips: 38 },
  { day: "Wed", trips: 55 },
  { day: "Thu", trips: 47 },
  { day: "Fri", trips: 63 },
  { day: "Sat", trips: 71 },
  { day: "Sun", trips: 35 },
];

export const revenueChartData = [
  { day: "Mon", revenue: 2100000 },
  { day: "Tue", revenue: 1850000 },
  { day: "Wed", revenue: 2750000 },
  { day: "Thu", revenue: 2300000 },
  { day: "Fri", revenue: 3100000 },
  { day: "Sat", revenue: 3500000 },
  { day: "Sun", revenue: 1700000 },
];

export const recentActivity = [
  { id: 1, text: "Andi Pratama menyelesaikan trip TRP-001", time: "5 menit lalu", type: "trip" as const },
  { id: 2, text: "Pembayaran TXN-006 menunggu konfirmasi", time: "15 menit lalu", type: "payment" as const },
  { id: 3, text: "Driver baru Pak Surya mendaftar", time: "1 jam lalu", type: "driver" as const },
  { id: 4, text: "Booking shuttle SB-004 dikonfirmasi", time: "2 jam lalu", type: "booking" as const },
  { id: 5, text: "Promo 'Voucher Rp 25.000' berakhir", time: "1 hari lalu", type: "promo" as const },
];
