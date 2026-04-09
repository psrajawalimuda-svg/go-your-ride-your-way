import { createClient } from "@supabase/supabase-js"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * User Module: Handles Profile management, Driver status, and Heartbeats.
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
      case 'update-profile': {
        const { full_name, avatar_url, phone_number } = payload
        const { data, error } = await supabase
          .from('profiles')
          .update({ full_name, avatar_url, phone_number, updated_at: new Date().toISOString() })
          .eq('id', user.id)
          .select()
          .single()

        if (error) throw error
        return new Response(JSON.stringify({ success: true, profile: data }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      case 'driver-status': {
        const { status, vehicle_details } = payload
        const { data, error } = await supabase
          .from('drivers')
          .upsert({ 
            id: user.id, 
            status, 
            vehicle_details, 
            last_heartbeat: new Date().toISOString(),
            is_active: true
          })
          .select()
          .single()

        if (error) throw error
        return new Response(JSON.stringify({ success: true, driver: data }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      case 'heartbeat': {
        const { error } = await supabase
          .from('drivers')
          .update({ last_heartbeat: new Date().toISOString() })
          .eq('id', user.id)

        if (error) throw error
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
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
