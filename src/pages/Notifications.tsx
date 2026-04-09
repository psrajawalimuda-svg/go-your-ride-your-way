import { useState, useMemo } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useNotifications } from "@/context/NotificationContext";
import { NotificationType } from "@/types/models";
import { format } from "date-fns";
import {
  Bell,
  Car,
  CheckCircle2,
  Clock,
  CreditCard,
  Bus,
  Trash2,
  Filter,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const typeIcons: Record<NotificationType, any> = {
  driver_found: Car,
  trip_started: Clock,
  trip_completed: CheckCircle2,
  payment_success: CreditCard,
  shuttle_reminder: Bus,
  system: Bell,
};

const typeColors: Record<NotificationType, string> = {
  driver_found: "bg-blue-100 text-blue-600",
  trip_started: "bg-orange-100 text-orange-600",
  trip_completed: "bg-green-100 text-green-600",
  payment_success: "bg-emerald-100 text-emerald-600",
  shuttle_reminder: "bg-purple-100 text-purple-600",
  system: "bg-gray-100 text-gray-600",
};

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState<NotificationType | "all">("all");

  const filteredNotifications = useMemo(() => {
    return filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  return (
    <MobileLayout>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">Notifications</h1>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setFilter("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("driver_found")}>Driver Found</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("trip_started")}>Trip Updates</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("payment_success")}>Payments</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("shuttle_reminder")}>Shuttle</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="p-6 bg-muted rounded-full">
              <Bell className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <p className="font-bold">No notifications yet</p>
              <p className="text-sm text-muted-foreground">
                We'll notify you when something important happens.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {filteredNotifications.map((n) => {
                const Icon = typeIcons[n.type] || Bell;
                return (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    drag="x"
                    dragConstraints={{ left: -100, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -60) {
                        deleteNotification(n.id);
                      }
                    }}
                    className={cn(
                      "relative group bg-card border border-border rounded-2xl p-4 flex gap-4 transition-all hover:shadow-md active:cursor-grabbing",
                      !n.isRead && "border-primary/20 bg-primary/[0.02]"
                    )}
                    onClick={() => markAsRead(n.id)}
                  >
                    {!n.isRead && (
                      <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full" />
                    )}
                    
                    <div className={cn("p-3 rounded-xl shrink-0 h-fit", typeColors[n.type])}>
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm">{n.title}</h3>
                        <span className="text-[10px] text-muted-foreground">
                          {format(new Date(n.createdAt), "HH:mm")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {n.message}
                      </p>
                      <div className="pt-2 flex items-center justify-between">
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                          {n.type.replace("_", " ")}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(n.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
