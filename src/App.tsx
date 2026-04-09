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
import { NotificationProvider } from "./context/NotificationContext";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Index from "./pages/Index";
import Shuttle from "./pages/Shuttle";
import Activity from "./pages/Activity";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import NotificationSettings from "./pages/NotificationSettings";
import RideBooking from "./pages/RideBooking";
import RideTracking from "./pages/RideTracking";
import Payment from "./pages/Payment";
import PaymentStatus from "./pages/PaymentStatus";
import NotFound from "./pages/NotFound";
import DriverLogin from "./pages/driver/DriverLogin";
import DriverHome from "./pages/driver/DriverHome";
import DriverTrip from "./pages/driver/DriverTrip";
import DriverEarnings from "./pages/driver/DriverEarnings";
import DesignSystem from "./pages/DesignSystem";

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
                  <NotificationProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <Routes>
                        <Route path="/" element={<Splash />} />
                        <Route path="/onboarding" element={<Onboarding />} />
                        <Route path="/home" element={<Index />} />
                        <Route path="/shuttle" element={<Shuttle />} />
                        <Route path="/activity" element={<Activity />} />
                      <Route path="/wallet" element={<Wallet />} />
                      <Route path="/profile" element={<Profile />} />
                       <Route path="/notifications" element={<Notifications />} />
                       <Route path="/notifications/settings" element={<NotificationSettings />} />
                       <Route path="/ride/book" element={<RideBooking />} />
                        <Route path="/ride/tracking" element={<RideTracking />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/payment/status" element={<PaymentStatus />} />
                        <Route path="/driver/login" element={<DriverLogin />} />
                        <Route path="/driver/home" element={<DriverHome />} />
                        <Route path="/driver/trip" element={<DriverTrip />} />
                        <Route path="/driver/earnings" element={<DriverEarnings />} />
                        <Route path="/design-system" element={<DesignSystem />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </BrowserRouter>
                  </NotificationProvider>
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
