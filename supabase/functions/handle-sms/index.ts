import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { corsHeaders } from './constants.ts'

console.log('Edge Function loaded and running')

serve(async (req) => {
  // Log absolutely everything about the request and environment
  console.log('========== NEW REQUEST ==========')
  console.log('Timestamp:', new Date().toISOString())
  console.log('Request URL:', req.url)
  console.log('Request method:', req.method)
  console.log('Request headers:', Object.fromEntries(req.headers.entries()))
  
  // Verify secrets are accessible (without logging their values)
  console.log('Checking Twilio secrets availability:')
  console.log('Has TWILIO_A2P_ACCOUNT_SID:', !!Deno.env.get('TWILIO_A2P_ACCOUNT_SID'))
  console.log('Has TWILIO_AUTH_TOKEN:', !!Deno.env.get('TWILIO_AUTH_TOKEN'))
  console.log('Has TWILIO_PHONE_NUMBER:', !!Deno.env.get('TWILIO_PHONE_NUMBER'))
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response('ok', { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'text/plain',
      }
    })
  }

  try {
    // Log raw request body
    const rawBody = await req.text()
    console.log('Raw request body:', rawBody)
    
    // Parse form data if it exists
    try {
      const formData = new URLSearchParams(rawBody)
      console.log('Parsed form data:', Object.fromEntries(formData.entries()))
    } catch (e) {
      console.log('Could not parse as form data:', e)
    }

    // Always return a 200 response for now
    console.log('Sending 200 response')
    return new Response(
      'Message received',
      { 
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain'
        }
      }
    )

  } catch (error) {
    console.error('Error processing request:', error)
    console.error('Error stack:', error.stack)
    
    // Still return 200 for Twilio
    return new Response(
      'Error processing message',
      { 
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain'
        }
      }
    )
  }
})