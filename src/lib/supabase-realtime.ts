import { createClient, RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'

// ─── Configuration ──────────────────────────────────────────────────────────

const MAX_RETRY_DELAY = 30000
const INITIAL_RETRY_DELAY = 1000
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const MAX_MESSAGES_PER_WINDOW = 100

// ─── Types ──────────────────────────────────────────────────────────────────

export type ConnectionState = 'INITIAL' | 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING'

export interface RealtimeMessage {
  type: 'driver_location' | 'trip_update' | 'dispatch_event'
  payload: any
}

// ─── Realtime Service ───────────────────────────────────────────────────────

class SupabaseRealtimeService {
  private supabase: SupabaseClient
  private channels: Map<string, RealtimeChannel> = new Map()
  private retryDelay = INITIAL_RETRY_DELAY
  private connectionState: ConnectionState = 'INITIAL'
  private messageCount = 0
  private lastWindowStart = Date.now()

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    this.supabase = createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })

    this.restoreConnectionState()
    this.setupHeartbeat()
  }

  // ── Connection Management ───────────────────────────────────────────────

  private async restoreConnectionState() {
    const savedState = localStorage.getItem('supabase_connection_state')
    if (savedState) {
      console.log(`[Realtime] Restoring connection state: ${savedState}`)
      // Attempt reconnection if it was connected before refresh
      if (savedState === 'CONNECTED') {
        this.connect()
      }
    }
  }

  private saveConnectionState(state: ConnectionState) {
    this.connectionState = state
    localStorage.setItem('supabase_connection_state', state)
  }

  private async connect() {
    this.saveConnectionState('CONNECTING')
    try {
      // In a real app, we'd wait for auth here
      this.saveConnectionState('CONNECTED')
      this.retryDelay = INITIAL_RETRY_DELAY
    } catch (error) {
      this.handleConnectionError()
    }
  }

  private handleConnectionError() {
    this.saveConnectionState('RECONNECTING')
    console.error(`[Realtime] Connection failed. Retrying in ${this.retryDelay}ms...`)
    
    setTimeout(() => {
      this.retryDelay = Math.min(this.retryDelay * 2, MAX_RETRY_DELAY)
      this.connect()
    }, this.retryDelay)
  }

  // ── Rate Limiting ───────────────────────────────────────────────────────

  private checkRateLimit(): boolean {
    const now = Date.now()
    if (now - this.lastWindowStart > RATE_LIMIT_WINDOW) {
      this.messageCount = 0
      this.lastWindowStart = now
    }

    if (this.messageCount >= MAX_MESSAGES_PER_WINDOW) {
      console.warn('[Realtime] Rate limit exceeded')
      return false
    }

    this.messageCount++
    return true
  }

  // ── Channels ────────────────────────────────────────────────────────────

  public subscribeToDriverLocation(driverId: string, callback: (payload: any) => void) {
    const channelName = `driver_locations:${driverId}`
    if (this.channels.has(channelName)) return

    const channel = this.supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'driver_locations',
        filter: `driver_id=eq.${driverId}`
      }, (payload) => {
        if (this.checkRateLimit()) {
          callback(payload.new)
        }
      })
      .subscribe()

    this.channels.set(channelName, channel)
  }

  public subscribeToTripUpdates(tripId: string, callback: (payload: any) => void) {
    const channelName = `trip_updates:${tripId}`
    
    const channel = this.supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'trips',
        filter: `id=eq.${tripId}`
      }, (payload) => {
        if (this.checkRateLimit()) {
          callback(payload.new)
          this.acknowledgeUpdate(tripId, payload.new.status)
        }
      })
      .subscribe()

    this.channels.set(channelName, channel)
  }

  private async acknowledgeUpdate(tripId: string, status: string) {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) return

      // Use Edge Function for acknowledgment tracking
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/trip-acknowledgment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await this.supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ trip_id: tripId, status, acknowledged_by: user.id })
      })
    } catch (e) {
      console.error('[Realtime] Acknowledgment failed', e)
    }
  }

  // ── Presence Tracking ───────────────────────────────────────────────────

  private setupHeartbeat() {
    setInterval(async () => {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) return

      // Update driver heartbeat if user is a driver
      // This is a simple RPC or direct update
      await this.supabase
        .from('drivers')
        .update({ last_heartbeat: new Date().toISOString() })
        .eq('id', user.id)
    }, 30000) // Every 30 seconds
  }

  // ── Fallback Mechanism ──────────────────────────────────────────────────

  public async pollTripStatus(tripId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single()
    
    if (error) throw error
    return data
  }
}

export const realtimeService = new SupabaseRealtimeService()
