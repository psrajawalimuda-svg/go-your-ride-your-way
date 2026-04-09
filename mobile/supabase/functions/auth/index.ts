import { createClient } from "@supabase/supabase-js"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Auth Module: Handles RBAC, Role assignment, and User Profile completion logic.
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
      case 'set-role': {
        const { role } = payload
        if (!['passenger', 'driver'].includes(role)) {
          throw new Error('Invalid role')
        }

        const { data, error } = await supabase
          .from('profiles')
          .update({ role, updated_at: new Date().toISOString() })
          .eq('id', user.id)
          .select()
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ success: true, profile: data }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      case 'get-permissions': {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) throw error

        // Simple RBAC mapping
        const permissions: Record<string, string[]> = {
          passenger: ['ride.create', 'ride.view_own', 'payment.manage'],
          driver: ['ride.accept', 'location.update', 'trip.update'],
          dispatcher: ['ride.assign', 'shuttle.manage', 'analytics.view'],
          admin: ['*']
        };
        const userPermissions = permissions[profile.role as string] || [];

        return new Response(JSON.stringify({ role: profile.role, permissions: userPermissions }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
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
