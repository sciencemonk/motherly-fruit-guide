import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Twilio } from "https://esm.sh/twilio@4.19.0"

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
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body
    const { phone_number } = await req.json()
    
    if (!phone_number) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    console.log('Generating code for:', phone_number)

    // Initialize Twilio client
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const twilioNumber = Deno.env.get('TWILIO_PHONE_NUMBER')
    
    if (!accountSid || !authToken || !twilioNumber) {
      console.error('Missing Twilio configuration')
      throw new Error('Twilio configuration incomplete')
    }

    const twilioClient = new Twilio(accountSid, authToken)

    // Store the verification code
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

    console.log('Stored verification code, sending SMS...')

    // Send SMS
    try {
      await twilioClient.messages.create({
        body: `Your Mother Athena verification code is: ${code}`,
        to: phone_number,
        from: twilioNumber,
      })

      console.log('SMS sent successfully')

      return new Response(
        JSON.stringify({ message: 'Verification code sent' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (twilioError) {
      console.error('Twilio error:', twilioError)
      throw new Error(`Failed to send SMS: ${twilioError.message}`)
    }
  } catch (error) {
    console.error('Error in send-verification-code:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to send verification code. Please try again.' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})