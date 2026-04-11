import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/context/AuthContext";
import { RideProvider } from "@/context/RideContext";
import { PaymentProvider } from "@/context/PaymentContext";
import { ShuttleProvider } from "@/context/ShuttleContext";
import { DriverProvider } from "./context/DriverContext";
import { DriverNotificationProvider } from "./context/DriverNotificationContext";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Shuttle from "./pages/Shuttle";
import Activity from "./pages/Activity";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import RideBooking from "./pages/RideBooking";
import RideTracking from "./pages/RideTracking";
import Payment from "./pages/Payment";
import PaymentStatus from "./pages/PaymentStatus";
import NotFound from "./pages/NotFound";
import DriverLogin from "./pages/driver/DriverLogin";
import DriverRegistration from "./pages/driver/DriverRegistration";
import DriverHome from "./pages/driver/DriverHome";
import DriverTrip from "./pages/driver/DriverTrip";
import DriverEarnings from "./pages/driver/DriverEarnings";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDrivers from "./pages/admin/AdminDrivers";
import AdminTrips from "./pages/admin/AdminTrips";
import AdminShuttle from "./pages/admin/AdminShuttle";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminPromos from "./pages/admin/AdminPromos";
import AdminSettings from "./pages/admin/AdminSettings";

import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="pyugo-theme">
      <TooltipProvider>
        <AuthProvider>
          <RideProvider>
            <ShuttleProvider>
              <DriverProvider>
                <DriverNotificationProvider>
                  <PaymentProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter
                      future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true,
                      }}
                    >
                      <Routes>
                        <Route path="/" element={<Splash />} />
                        <Route path="/onboarding" element={<Onboarding />} />
                        <Route path="/login" element={<Login />} />
                        
                        {/* Passenger Routes */}
                        <Route path="/home" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                        <Route path="/shuttle" element={<ProtectedRoute><Shuttle /></ProtectedRoute>} />
                        <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
                        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/ride/booking" element={<ProtectedRoute><RideBooking /></ProtectedRoute>} />
                        <Route path="/ride/tracking" element={<ProtectedRoute><RideTracking /></ProtectedRoute>} />
                        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
                        <Route path="/payment/status" element={<ProtectedRoute><PaymentStatus /></ProtectedRoute>} />
                        
                        {/* Driver Routes */}
                        <Route path="/driver/login" element={<DriverLogin />} />
                        <Route path="/driver/register" element={<ProtectedRoute><DriverRegistration /></ProtectedRoute>} />
                        <Route path="/driver/home" element={<ProtectedRoute allowedRoles={["driver"]}><DriverHome /></ProtectedRoute>} />
                        <Route path="/driver/trip" element={<ProtectedRoute allowedRoles={["driver"]}><DriverTrip /></ProtectedRoute>} />
                        <Route path="/driver/earnings" element={<ProtectedRoute allowedRoles={["driver"]}><DriverEarnings /></ProtectedRoute>} />
                        
                        {/* Admin Routes */}
                        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />
                        <Route path="/admin/drivers" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDrivers /></ProtectedRoute>} />
                        <Route path="/admin/trips" element={<ProtectedRoute allowedRoles={["admin"]}><AdminTrips /></ProtectedRoute>} />
                        <Route path="/admin/shuttle" element={<ProtectedRoute allowedRoles={["admin"]}><AdminShuttle /></ProtectedRoute>} />
                        <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPayments /></ProtectedRoute>} />
                        <Route path="/admin/promos" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPromos /></ProtectedRoute>} />
                        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSettings /></ProtectedRoute>} />
                        
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </BrowserRouter>
                  </PaymentProvider>
                </DriverNotificationProvider>
              </DriverProvider>
            </ShuttleProvider>
          </RideProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
