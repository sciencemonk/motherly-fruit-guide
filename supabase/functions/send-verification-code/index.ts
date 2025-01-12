import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import twilio from "npm:twilio"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { phone_number } = await req.json()

    if (!phone_number) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10) // Code expires in 10 minutes

    // Store the verification code
    const { error: insertError } = await supabaseClient
      .from('verification_codes')
      .insert({
        phone_number,
        code,
        expires_at: expiresAt.toISOString()
      })

    if (insertError) {
      console.error('Error storing verification code:', insertError)
      throw insertError
    }

    // Initialize Twilio client with A2P credentials
    const accountSid = Deno.env.get('TWILIO_A2P_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const messagingServiceSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID')
    
    if (!accountSid || !authToken || !messagingServiceSid) {
      console.error('Missing Twilio configuration:', {
        hasAccountSid: !!accountSid,
        hasAuthToken: !!authToken,
        hasMessagingServiceSid: !!messagingServiceSid
      })
      throw new Error('Missing Twilio configuration')
    }

    console.log('Initializing Twilio client with A2P account...')
    const client = twilio(accountSid, authToken)

    console.log('Sending SMS to:', phone_number)
    // Send SMS
    const message = await client.messages.create({
      body: `Your Morpheus verification code is: ${code}`,
      messagingServiceSid,
      to: phone_number
    })

    console.log('SMS sent successfully:', message.sid)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})