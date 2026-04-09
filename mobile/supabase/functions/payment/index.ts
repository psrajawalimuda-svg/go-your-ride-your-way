import { createClient } from "@supabase/supabase-js"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Payment Module: Handles transaction tracking and status updates.
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
      case 'initiate-payment': {
        const { booking_id, trip_id, amount, currency = 'IDR', payment_method } = payload
        
        // 1. Create the payment record
        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .insert({
            user_id: user.id,
            booking_id,
            trip_id,
            amount,
            currency,
            status: 'pending',
            payment_method
          })
          .select()
          .single()

        if (paymentError) throw paymentError

        // 2. Integration with External Gateway (Mock Logic)
        // In a real system, you would call a Stripe/Midtrans/Xendit API here.
        // For this implementation, we'll return the payment record with a success status.
        const { data: updatedPayment, error: updateError } = await supabase
          .from('payments')
          .update({ 
            status: 'succeeded', 
            transaction_id: `txn_${Date.now()}`,
            provider_response: { gateway: 'mock', status: 'success' }
          })
          .eq('id', payment.id)
          .select()
          .single()

        if (updateError) throw updateError

        return new Response(JSON.stringify({ success: true, payment: updatedPayment }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      case 'get-payment-history': {
        const { data: payments, error: paymentError } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (paymentError) throw paymentError

        return new Response(JSON.stringify({ success: true, payments }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
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
