import { useConnectionStatus } from "@/hooks/use-realtime";
import { Wifi, WifiOff, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const statusConfig = {
  connected: {
    label: "Connected",
    color: "bg-emerald-500",
    icon: Wifi,
    desc: "You are connected to the dispatch server. Real-time updates are active."
  },
  connecting: {
    label: "Connecting",
    color: "bg-amber-500",
    icon: Loader2,
    desc: "Establishing connection to the dispatch server...",
    animate: "animate-spin"
  },
  reconnecting: {
    label: "Reconnecting",
    color: "bg-amber-600",
    icon: Loader2,
    desc: "Connection lost. Automatically attempting to reconnect...",
    animate: "animate-spin"
  },
  poor: {
    label: "Poor Connection",
    color: "bg-orange-500",
    icon: AlertCircle,
    desc: "Connection is unstable. Real-time updates may be delayed."
  },
  disconnected: {
    label: "Disconnected",
    color: "bg-destructive",
    icon: WifiOff,
    desc: "Not connected to the dispatch server. Please check your internet connection."
  }
};

export function ConnectionStatusBadge({ className }: { className?: string }) {
  const status = useConnectionStatus();
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.disconnected;
  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center gap-1.5 cursor-help", className)}>
            <div className={cn("w-2 h-2 rounded-full", config.color, status === "connected" ? "animate-pulse" : "")} />
            <Badge variant="outline" className={cn("text-[10px] px-1.5 h-5 font-bold uppercase tracking-wider", className)}>
              <Icon className={cn("h-3 w-3 mr-1", config.animate)} />
              {config.label}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[200px] text-xs">
          <p>{config.desc}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
