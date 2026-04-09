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

    const { trip_id, status, acknowledged_by } = await req.json()

    // 1. Update Trip Status
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .update({ status })
      .eq('id', trip_id)
      .select()
      .single()

    if (tripError) throw tripError

    // 2. Broadcast to a specific channel for acknowledgments
    // This could also be stored in a separate table for tracking
    const { error: logError } = await supabase
      .from('dispatch_events')
      .insert({
        trip_id,
        event_type: 'driver_assigned', // or relevant event
        metadata: { status, acknowledged_by, timestamp: new Date().toISOString() }
      })

    if (logError) throw logError

    return new Response(
      JSON.stringify({ success: true, trip }),
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
