import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/context/AuthContext";
import { RideProvider } from "@/context/RideContext";
import { PaymentProvider } from "@/context/PaymentContext";
import { ShuttleProvider } from "@/context/ShuttleContext";
import { DriverProvider } from "./context/DriverContext";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <RideProvider>
            <PaymentProvider>
              <ShuttleProvider>
                <DriverProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Splash />} />
                      <Route path="/onboarding" element={<Onboarding />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/home" element={<Index />} />
                      <Route path="/shuttle" element={<Shuttle />} />
                      <Route path="/activity" element={<Activity />} />
                      <Route path="/wallet" element={<Wallet />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/ride/book" element={<RideBooking />} />
                      <Route path="/ride/tracking" element={<RideTracking />} />
                      <Route path="/payment" element={<Payment />} />
                      <Route path="/payment/status" element={<PaymentStatus />} />
                      <Route path="/driver/login" element={<DriverLogin />} />
                      <Route path="/driver/home" element={<DriverHome />} />
                      <Route path="/driver/trip" element={<DriverTrip />} />
                      <Route path="/driver/earnings" element={<DriverEarnings />} />
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/users" element={<AdminUsers />} />
                      <Route path="/admin/drivers" element={<AdminDrivers />} />
                      <Route path="/admin/trips" element={<AdminTrips />} />
                      <Route path="/admin/shuttle" element={<AdminShuttle />} />
                      <Route path="/admin/payments" element={<AdminPayments />} />
                      <Route path="/admin/promos" element={<AdminPromos />} />
                      <Route path="/admin/settings" element={<AdminSettings />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </DriverProvider>
              </ShuttleProvider>
            </PaymentProvider>
          </RideProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
