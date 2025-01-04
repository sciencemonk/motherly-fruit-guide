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
    headers: Object.fromEntries(req.headers.entries())
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
    
    console.log('Sending SMS with params:', {
      from: From,
      to: To,
      body: Body?.substring(0, 50) + '...' // Log first 50 chars for privacy
    })

    const messageSid = await sendTwilioResponse(Body, To)
    
    console.log('SMS sent successfully:', messageSid)

    return new Response(JSON.stringify({ success: true, messageSid }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error sending SMS:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})