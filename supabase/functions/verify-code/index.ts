import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { phone_number, code } = await req.json()

    // Verify the code
    const { data: codes, error: fetchError } = await supabaseClient
      .from('verification_codes')
      .select('*')
      .eq('phone_number', phone_number)
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)

    if (fetchError) throw fetchError
    if (!codes || codes.length === 0) {
      throw new Error('Invalid or expired code')
    }

    // Mark the code as used
    const { error: updateError } = await supabaseClient
      .from('verification_codes')
      .update({ used: true })
      .eq('id', codes[0].id)

    if (updateError) throw updateError

    // Check if user exists
    const { data: profiles } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('phone_number', phone_number)
      .single()

    if (!profiles) {
      // Create new profile if it doesn't exist
      const { error: insertError } = await supabaseClient
        .from('profiles')
        .insert({ phone_number })

      if (insertError) throw insertError
    }

    // Generate a secure random password for the user
    const token = crypto.randomUUID()

    // Create or update auth user
    const { error: authError } = await supabaseClient.auth.admin.createUser({
      phone: phone_number,
      password: token,
      email_confirm: true,
      phone_confirm: true,
    })

    if (authError && authError.message !== 'User already registered') {
      throw authError
    }

    return new Response(
      JSON.stringify({ token }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})