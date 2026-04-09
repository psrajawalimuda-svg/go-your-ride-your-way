import { MobileLayout } from "@/components/layout/MobileLayout";
import { useNotifications } from "@/context/NotificationContext";
import { NotificationType } from "@/types/models";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, Smartphone, Shield, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const notificationTypes: { id: NotificationType; label: string; desc: string }[] = [
  { id: "driver_found", label: "Driver Found", desc: "Get notified when a driver accepts your ride" },
  { id: "trip_started", label: "Trip Started", desc: "Alerts when your journey begins" },
  { id: "trip_completed", label: "Trip Completed", desc: "Summary and receipt after your ride" },
  { id: "payment_success", label: "Payments", desc: "Confirmation of successful transactions" },
  { id: "shuttle_reminder", label: "Shuttle Reminders", desc: "Reminders for your upcoming shuttle trips" },
  { id: "system", label: "System Updates", desc: "Important news and security alerts" },
];

export default function NotificationSettings() {
  const navigate = useNavigate();
  const { preferences, updatePreferences } = useNotifications();

  if (!preferences) return null;

  const handleTogglePush = (checked: boolean) => {
    updatePreferences({ ...preferences, pushEnabled: checked });
  };

  const handleToggleType = (type: NotificationType, checked: boolean) => {
    updatePreferences({
      ...preferences,
      types: { ...preferences.types, [type]: checked },
    });
  };

  return (
    <MobileLayout hideNav>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-xl hover:bg-secondary/60 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-extrabold">Notification Settings</h1>
        </div>

        {/* Master Toggle */}
        <Card className="p-5 rounded-2xl border-primary/20 bg-primary/[0.02]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Label className="text-sm font-bold">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">Master toggle for all alerts</p>
              </div>
            </div>
            <Switch
              checked={preferences.pushEnabled}
              onCheckedChange={handleTogglePush}
            />
          </div>
        </Card>

        {/* Detailed Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Alert Categories
            </h3>
          </div>
          
          <div className="space-y-2">
            {notificationTypes.map((type) => (
              <Card key={type.id} className="p-4 rounded-2xl border-border hover:border-primary/20 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <Label className="text-sm font-bold">{type.label}</Label>
                    <p className="text-xs text-muted-foreground">{type.desc}</p>
                  </div>
                  <Switch
                    checked={preferences.types[type.id]}
                    onCheckedChange={(checked) => handleToggleType(type.id, checked)}
                    disabled={!preferences.pushEnabled}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <Card className="p-4 rounded-2xl bg-muted/50 border-none flex gap-3">
          <Info className="h-5 w-5 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            You can also manage these settings in your device system preferences. Disabling push notifications will not affect in-app notifications.
          </p>
        </Card>
      </div>
    </MobileLayout>
  );
}
