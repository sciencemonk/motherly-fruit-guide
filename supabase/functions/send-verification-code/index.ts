import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import twilio from "npm:twilio"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders 
    })
  }

  try {
    console.log('Starting verification code process')
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body
    const { phone_number } = await req.json()
    
    if (!phone_number) {
      console.error('No phone number provided')
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Generating verification code for:', phone_number)

    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    // Initialize Twilio client
    const accountSid = Deno.env.get('TWILIO_A2P_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const messagingServiceSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID')
    
    if (!accountSid || !authToken || !messagingServiceSid) {
      console.error('Missing Twilio configuration')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Store the verification code first
    try {
      const { error: dbError } = await supabaseClient
        .from('verification_codes')
        .insert({
          phone_number,
          code,
          expires_at: expiresAt.toISOString(),
        })

      if (dbError) {
        console.error('Database error:', dbError)
        throw dbError
      }
      
      console.log('Verification code stored successfully')
    } catch (dbError) {
      console.error('Error storing verification code:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to store verification code' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Send SMS using Twilio
    try {
      const client = twilio(accountSid, authToken)
      await client.messages.create({
        body: `Your Mother Athena verification code is: ${code}`,
        to: phone_number,
        messagingServiceSid: messagingServiceSid,
      })
      
      console.log('SMS sent successfully')

      return new Response(
        JSON.stringify({ message: 'Verification code sent successfully' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } catch (twilioError) {
      console.error('Twilio error:', twilioError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send SMS',
          details: twilioError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})