import { supabase } from "@/integrations/supabase/client";

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "reconnecting" | "poor";

export type RealtimeChannel =
  | "driver:location"
  | "trip:status"
  | "dispatch:request"
  | "dispatch:response";

export interface DriverLocationPayload {
  driverId: string;
  coords: [number, number];
  heading: number;
  speed: number;
  timestamp: number;
}

export interface TripStatusPayload {
  tripId: string;
  status: string;
  timestamp: number;
}

export interface DispatchRequestPayload {
  requestId: string;
  pickup: { label: string; coords: [number, number] };
  dropoff: { label: string; coords: [number, number] };
  fare: number;
  passengerName: string;
  estimatedDistance: string;
  estimatedDuration: string;
  priority?: "normal" | "premium" | "emergency";
  vehicleType?: string;
  driverId?: string; // Targeted dispatch
}

export interface DispatchResponsePayload {
  requestId: string;
  accepted: boolean;
  driverId: string;
  reason?: "timeout" | "declined" | "busy";
}

export type ChannelPayloadMap = {
  "driver:location": DriverLocationPayload;
  "trip:status": TripStatusPayload;
  "dispatch:request": DispatchRequestPayload;
  "dispatch:response": DispatchResponsePayload;
};

type Listener<T = unknown> = (data: T) => void;

interface ChannelMessage {
  channel: RealtimeChannel;
  data: unknown;
  source: string;
}

class RealtimeService {
  private listeners = new Map<RealtimeChannel, Set<Listener>>();
  private _status: ConnectionStatus = "disconnected";
  private statusListeners = new Set<Listener<ConnectionStatus>>();
  private readonly instanceId = Math.random().toString(36).slice(2, 8);
  private supabaseChannel = supabase.channel("pyugo-global");
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 10;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private lastPingTime = 0;
  private pingInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.connect();
    this.startPing();
  }

  // ── Connection lifecycle ──────────────────────────────────────────────

  private connect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.setStatus(this.reconnectAttempts > 0 ? "reconnecting" : "connecting");

    this.supabaseChannel
      .on("broadcast", { event: "message" }, (payload) => {
        const { channel, data, source } = payload.payload as ChannelMessage;
        if (source === this.instanceId) return;
        this.emit(channel, data, true);
      })
      .on("broadcast", { event: "ping-ack" }, () => {
        const latency = Date.now() - this.lastPingTime;
        if (latency > 2000) {
          this.setStatus("poor");
        } else {
          this.setStatus("connected");
        }
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          this.reconnectAttempts = 0;
          this.setStatus("connected");
          if (import.meta.env.DEV) {
            console.log("[Realtime] Connected to Supabase — instance:", this.instanceId);
          }
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          this.handleDisconnect();
        }
      });
  }

  private handleDisconnect() {
    this.setStatus("disconnected");
    this.scheduleReconnect();
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("[Realtime] Max reconnect attempts reached");
      return;
    }

    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 15000);
    this.reconnectAttempts++;

    if (import.meta.env.DEV) {
      console.log(`[Realtime] Reconnecting in ${Math.round(delay)}ms (Attempt ${this.reconnectAttempts})`);
    }

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startPing() {
    this.pingInterval = setInterval(() => {
      if (this._status === "connected" || this._status === "poor") {
        this.lastPingTime = Date.now();
        this.supabaseChannel.send({
          type: "broadcast",
          event: "ping",
          payload: { timestamp: this.lastPingTime },
        });
      }
    }, 10000);
  }

  private setStatus(s: ConnectionStatus) {
    if (this._status === s) return;
    this._status = s;
    this.statusListeners.forEach((fn) => fn(s));
  }

  get status(): ConnectionStatus {
    return this._status;
  }

  // ── Pub / Sub ─────────────────────────────────────────────────────────

  subscribe<C extends RealtimeChannel>(
    channel: C,
    callback: Listener<ChannelPayloadMap[C]>
  ): () => void {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set());
    }
    const set = this.listeners.get(channel)!;
    set.add(callback as Listener);

    // Return unsubscribe function
    return () => {
      set.delete(callback as Listener);
      if (set.size === 0) this.listeners.delete(channel);
    };
  }

  publish<C extends RealtimeChannel>(channel: C, data: ChannelPayloadMap[C]) {
    // Local emit
    this.emit(channel, data, false);

    // Supabase broadcast
    this.supabaseChannel.send({
      type: "broadcast",
      event: "message",
      payload: {
        channel,
        data,
        source: this.instanceId,
      } as ChannelMessage,
    });
  }

  private emit(channel: RealtimeChannel, data: unknown, fromExternal: boolean) {
    const set = this.listeners.get(channel);
    if (!set) return;

    if (import.meta.env.DEV && fromExternal) {
      console.log(`[Realtime] ← ${channel}`, data);
    }

    set.forEach((fn) => {
      try { fn(data); } catch (e) { console.error("[Realtime] Listener error:", e); }
    });
  }

  // ── Connection status subscription ────────────────────────────────────

  onStatusChange(callback: Listener<ConnectionStatus>): () => void {
    this.statusListeners.add(callback);
    return () => { this.statusListeners.delete(callback); };
  }

  // ── Cleanup ───────────────────────────────────────────────────────────

  destroy() {
    this.supabaseChannel.unsubscribe();
    this.listeners.clear();
    this.statusListeners.clear();
    this.setStatus("disconnected");
  }
}

// Singleton
export const realtime = new RealtimeService();
