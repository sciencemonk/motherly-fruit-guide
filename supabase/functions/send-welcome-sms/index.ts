import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import twilio from 'npm:twilio'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
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
    console.log('Received request to send SMS to:', to)

    if (!to || !message) {
      throw new Error('Missing required fields: to and message')
    }

    // Get Twilio credentials
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const messagingServiceSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID') || 'MG1fa945c66e3013f6a9b3ad77bf8a05e4'

    if (!accountSid || !authToken) {
      console.error('Missing Twilio credentials')
      throw new Error('Missing Twilio credentials')
    }

    console.log('Initializing Twilio client...')
    const client = twilio(accountSid, authToken)

    // Ensure the phone number is in E.164 format
    // Remove any non-digit characters and ensure it starts with +
    const formattedPhone = to.replace(/\D/g, '')
    const e164Phone = formattedPhone.startsWith('+') ? formattedPhone : `+${formattedPhone}`
    console.log('Formatted phone number:', e164Phone)

    // Send the message using Messaging Service SID
    console.log('Attempting to send SMS...')
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
        status: error.status || 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})