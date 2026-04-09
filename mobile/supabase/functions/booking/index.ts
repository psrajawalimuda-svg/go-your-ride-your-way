import { createClient } from "@supabase/supabase-js"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Ride/Shuttle Booking Module: Handles Instant and Scheduled bookings.
 */
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify JWT and get user context
    const authHeader = req.headers.get('Authorization')
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader?.replace('Bearer ', '') ?? '')

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const { action, payload } = await req.json()

    switch (action) {
      case 'create-booking': {
        const { booking_type, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, scheduled_at, shuttle_schedule_id, metadata } = payload
        
        // 1. Create the booking entry
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .insert({
            user_id: user.id,
            booking_type,
            pickup_location: `POINT(${pickup_lng} ${pickup_lat})`,
            dropoff_location: `POINT(${dropoff_lng} ${dropoff_lat})`,
            scheduled_at,
            shuttle_schedule_id,
            metadata,
            status: 'pending'
          })
          .select()
          .single()

        if (bookingError) throw bookingError

        // 2. If instant ride, trigger dispatch logic
        if (booking_type === 'instant') {
          // Trigger the existing dispatch-ride Edge Function
          const { error: dispatchError } = await supabase.functions.invoke('dispatch-ride', {
            body: { 
              trip_id: booking.id, 
              lat: pickup_lat, 
              lng: pickup_lng 
            }
          })
          if (dispatchError) throw dispatchError
        }

        return new Response(JSON.stringify({ success: true, booking }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      case 'get-nearby-shuttles': {
        const { lat, lng, radius_meters = 2000 } = payload
        const { data: routes, error: routeError } = await supabase
          .from('shuttle_routes')
          .select(`
            id, name, start_location, end_location,
            shuttle_schedules (id, departure_time, days_of_week, capacity)
          `)
          .filter('is_active', 'eq', true)
          .filter('deleted_at', 'is', null)

        if (routeError) throw routeError

        // In a real scenario, we'd use a PostGIS RPC to filter these by distance
        return new Response(JSON.stringify({ success: true, routes }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      default:
        throw new Error(`Unsupported action: ${action}`)
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
