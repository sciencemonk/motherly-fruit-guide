import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { corsHeaders } from './constants.ts'
import { createHmac } from "https://deno.land/std@0.182.0/crypto/mod.ts"

console.log('Edge Function loaded and running')

function validateTwilioSignature(url: string, params: Record<string, string>, twilioSignature: string, authToken: string): boolean {
  // Sort the params
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc: Record<string, string>, key) => {
      acc[key] = params[key];
      return acc;
    }, {});

  // Create the string to sign
  const stringToSign = url + Object.keys(sortedParams)
    .map(key => key + sortedParams[key])
    .join('');

  // Create HMAC
  const hmac = createHmac("sha1", authToken);
  hmac.update(stringToSign);
  const expectedSignature = hmac.digest("base64");

  console.log('Expected signature:', expectedSignature);
  console.log('Received signature:', twilioSignature);

  return expectedSignature === twilioSignature;
}

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
    
    // Parse form data
    const formData = new URLSearchParams(rawBody)
    const params = Object.fromEntries(formData.entries())
    console.log('Parsed form data:', params)

    // Get Twilio signature from headers
    const twilioSignature = req.headers.get('X-Twilio-Signature')
    console.log('Twilio signature:', twilioSignature)

    if (!twilioSignature) {
      console.error('No Twilio signature found in request headers')
      return new Response('Unauthorized', { status: 401 })
    }

    // Get auth token from environment
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    if (!authToken) {
      console.error('TWILIO_AUTH_TOKEN not found in environment')
      return new Response('Server configuration error', { status: 500 })
    }

    // Validate the signature
    const isValid = validateTwilioSignature(
      req.url,
      params,
      twilioSignature,
      authToken
    )

    if (!isValid) {
      console.error('Invalid Twilio signature')
      return new Response('Unauthorized', { status: 403 })
    }

    console.log('Twilio signature validated successfully')

    // Always return a 200 response for now
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