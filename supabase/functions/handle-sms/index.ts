import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { sendTwilioResponse } from './twilio.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  console.log('New SMS request received:', {
    method: req.method,
    url: req.url,
  })

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders
    })
  }

  try {
    const { From, To, Body } = await req.json()
    
    if (!To || !Body) {
      console.error('Missing required parameters:', { To, Body })
      throw new Error('Missing required parameters: To and Body are required')
    }

    console.log('Sending SMS with params:', {
      from: From,
      to: To,
      bodyPreview: Body?.substring(0, 50) + '...' // Log first 50 chars for privacy
    })

    const messageSid = await sendTwilioResponse(Body, To)
    
    console.log('SMS sent successfully:', messageSid)

    return new Response(
      JSON.stringify({ success: true, messageSid }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending SMS:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})