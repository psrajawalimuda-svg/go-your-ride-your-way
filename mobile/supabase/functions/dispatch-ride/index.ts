import { createClient } from "@supabase/supabase-js"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { trip_id, lat, lng } = await req.json()

    // 1. Find drivers within 5km radius using PostGIS
    const { data: nearbyDrivers, error: driverError } = await supabase.rpc('find_nearby_drivers', {
      pickup_lat: lat,
      pickup_lng: lng,
      radius_meters: 5000
    })

    if (driverError) throw driverError

    // 2. Broadcast dispatch events to each driver
    const events = nearbyDrivers.map((driver: any) => ({
      trip_id,
      driver_id: driver.id,
      event_type: 'new_request',
      metadata: { distance: driver.distance }
    }))

    const { error: eventError } = await supabase
      .from('dispatch_events')
      .insert(events)

    if (eventError) throw eventError

    // 3. Set a timeout for driver responses (15s)
    // In a real system, this would be a background job or a scheduled task.
    // For this implementation, we'll return the list of notified drivers.

    return new Response(
      JSON.stringify({ success: true, notified_drivers: nearbyDrivers.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
