import { User, Bell, CreditCard, Shield, HelpCircle, LogOut, ChevronRight, Star, Sun, Moon } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

const menuItems = [
  { icon: CreditCard, label: "Payment Methods", desc: "Manage cards & wallets", path: "/payment" },
  { icon: Bell, label: "Notifications", desc: "Alerts & push settings", path: "/notifications/settings" },
  { icon: Shield, label: "Safety", desc: "Emergency contacts & settings", path: "/safety" },
  { icon: Star, label: "Rewards", desc: "Points & promotions", path: "/rewards" },
  { icon: HelpCircle, label: "Help Center", desc: "FAQ & support", path: "/help" },
];

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="px-4 pt-6 space-y-5">
        {/* Profile header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-5 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-extrabold">Guest User</h2>
                <p className="text-sm text-muted-foreground">Sign in for full features</p>
              </div>
            </div>
            <Button className="w-full mt-4 h-11 rounded-xl font-bold">
              Sign In / Register
            </Button>
          </Card>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Rides", value: "24" },
            { label: "Shuttles", value: "8" },
            { label: "Rating", value: "4.9" },
          ].map((stat) => (
            <Card key={stat.label} className="p-3 rounded-2xl text-center">
              <p className="text-xl font-extrabold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-secondary/60 transition-colors"
        >
          <div className="p-2 rounded-lg bg-secondary">
            {theme === "light" ? (
              <Moon className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Sun className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold">{theme === "light" ? "Dark Mode" : "Light Mode"}</p>
            <p className="text-xs text-muted-foreground">Switch appearance</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Menu */}
        <div className="space-y-1">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-secondary/60 transition-colors"
            >
              <div className="p-2 rounded-lg bg-secondary">
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </motion.button>
          ))}
        </div>

        <button className="w-full flex items-center justify-center gap-2 p-3 text-destructive font-semibold text-sm rounded-xl hover:bg-destructive/5 transition-colors">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </MobileLayout>
  );
}
