import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Twilio } from 'npm:twilio'

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

    const { phone_number } = await req.json()

    if (!phone_number) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    // Initialize Twilio client
    const accountSid = Deno.env.get('TWILIO_A2P_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const messagingServiceSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID')
    
    if (!accountSid || !authToken || !messagingServiceSid) {
      console.error('Missing Twilio configuration:', {
        hasAccountSid: !!accountSid,
        hasAuthToken: !!authToken,
        hasMessagingServiceSid: !!messagingServiceSid
      })
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    const client = new Twilio(accountSid, authToken)

    try {
      // Store the verification code
      const { error: insertError } = await supabaseClient
        .from('verification_codes')
        .insert({
          phone_number,
          code,
          expires_at: expiresAt.toISOString()
        })

      if (insertError) throw insertError

      // Update the profile's login code
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ login_code: code })
        .eq('phone_number', phone_number)

      if (updateError) {
        // If no profile exists, create one
        const { error: createError } = await supabaseClient
          .from('profiles')
          .insert({
            phone_number,
            login_code: code
          })
        
        if (createError) throw createError
      }

      // Send SMS
      await client.messages.create({
        body: `Your Ducil verification code is: ${code}`,
        to: phone_number,
        messagingServiceSid: messagingServiceSid,
      })
      
      console.log('SMS sent successfully')

      return new Response(
        JSON.stringify({ success: true }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } catch (error) {
      console.error('Error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to send SMS', details: error.message }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})