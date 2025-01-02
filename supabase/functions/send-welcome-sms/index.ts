import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import twilio from 'npm:twilio'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Received request to send-welcome-sms function')
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    })
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    const { to, message } = await req.json()
    console.log('Request payload:', { to, hasMessage: !!message })

    if (!to || !message) {
      throw new Error('Missing required fields: to and message')
    }

    // Get Twilio credentials
    const accountSid = Deno.env.get('TWILIO_A2P_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const messagingServiceSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID')

    // Log credential availability for debugging
    console.log('Checking Twilio credentials:', {
      hasAccountSid: !!accountSid,
      hasAuthToken: !!authToken,
      hasMessagingServiceSid: !!messagingServiceSid
    })

    if (!accountSid || !authToken || !messagingServiceSid) {
      console.error('Missing Twilio credentials')
      throw new Error('Missing Twilio credentials')
    }

    console.log('Initializing Twilio client...')
    const client = twilio(accountSid, authToken)

    // Ensure the phone number is in E.164 format
    const formattedPhone = to.replace(/\D/g, '')
    const e164Phone = formattedPhone.startsWith('+') ? formattedPhone : `+${formattedPhone}`

    // Basic E.164 validation
    if (!/^\+[1-9]\d{1,14}$/.test(e164Phone)) {
      throw new Error(`Invalid phone number format: ${e164Phone}`)
    }

    console.log('Formatted phone number:', e164Phone)

    // Send the message using Messaging Service SID
    console.log('Attempting to send SMS using Messaging Service SID:', messagingServiceSid)
    const twilioMessage = await client.messages.create({
      body: message,
      to: e164Phone,
      messagingServiceSid: messagingServiceSid
    })

    console.log('SMS sent successfully:', twilioMessage.sid)

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: twilioMessage.sid 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in send-welcome-sms function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString(),
        timestamp: new Date().toISOString()
      }),
      { 
        status: error.status || 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})