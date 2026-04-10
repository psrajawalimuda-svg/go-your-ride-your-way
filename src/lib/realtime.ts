// ─── Realtime Service ───────────────────────────────────────────────────────
// Client-side event bus with BroadcastChannel for cross-tab communication.
// Mirrors a WebSocket/Firebase API so the transport can be swapped later.

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "reconnecting";

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
}

export interface DispatchResponsePayload {
  requestId: string;
  accepted: boolean;
  driverId: string;
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
  private broadcastChannel: BroadcastChannel | null = null;
  private _status: ConnectionStatus = "disconnected";
  private statusListeners = new Set<Listener<ConnectionStatus>>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly instanceId = Math.random().toString(36).slice(2, 8);

  constructor() {
    this.connect();
  }

  // ── Connection lifecycle ──────────────────────────────────────────────

  private connect() {
    this.setStatus("connecting");

    try {
      if (typeof BroadcastChannel !== "undefined") {
        this.broadcastChannel = new BroadcastChannel("pyugo-realtime");
        this.broadcastChannel.onmessage = (event: MessageEvent<ChannelMessage>) => {
          const { channel, data, source } = event.data;
          // Ignore messages from self
          if (source === this.instanceId) return;
          this.emit(channel, data, true);
        };
        this.broadcastChannel.onmessageerror = () => this.handleDisconnect();
      }

      this.reconnectAttempts = 0;
      this.setStatus("connected");

      if (import.meta.env.DEV) {
        console.log("[Realtime] Connected — instance:", this.instanceId);
      }
    } catch {
      this.handleDisconnect();
    }
  }

  private handleDisconnect() {
    this.setStatus("disconnected");
    this.scheduleReconnect();
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      if (import.meta.env.DEV) {
        console.warn("[Realtime] Max reconnect attempts reached");
      }
      return;
    }

    this.setStatus("reconnecting");
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      this.broadcastChannel?.close();
      this.broadcastChannel = null;
      this.connect();
    }, delay);
  }

  private setStatus(s: ConnectionStatus) {
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

    // Cross-tab broadcast
    try {
      this.broadcastChannel?.postMessage({
        channel,
        data,
        source: this.instanceId,
      } satisfies ChannelMessage);
    } catch {
      // BroadcastChannel may be closed
    }
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
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.broadcastChannel?.close();
    this.broadcastChannel = null;
    this.listeners.clear();
    this.statusListeners.clear();
    this.setStatus("disconnected");
  }
}

// Singleton
export const realtime = new RealtimeService();
