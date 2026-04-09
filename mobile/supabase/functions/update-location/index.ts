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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { lat, lng, heading, speed } = await req.json()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // Throttling: Max 12 updates per minute (1 update every 5 seconds)
    const { data: lastLocation, error: fetchError } = await supabase
      .from('driver_locations')
      .select('timestamp')
      .eq('driver_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!fetchError && lastLocation) {
      const lastTime = new Date(lastLocation.timestamp).getTime()
      const now = new Date().getTime()
      if (now - lastTime < 5000) {
        return new Response(
          JSON.stringify({ error: 'Throttled', message: 'Maximum 12 updates per minute' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Insert new location
    const { error: insertError } = await supabase
      .from('driver_locations')
      .insert({
        driver_id: user.id,
        location: `POINT(${lng} ${lat})`,
        heading,
        speed,
        timestamp: new Date().toISOString()
      })

    if (insertError) throw insertError

    // Update driver heartbeat
    await supabase
      .from('drivers')
      .update({ last_heartbeat: new Date().toISOString() })
      .eq('id', user.id)

    return new Response(
      JSON.stringify({ success: true }),
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
