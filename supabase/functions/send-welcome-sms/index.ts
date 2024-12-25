import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Twilio } from 'npm:twilio'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

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
    const { to, message } = await req.json()

    console.log('Attempting to send welcome SMS to:', to)

    // Initialize Twilio client with environment variables
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER')

    if (!accountSid || !authToken || !fromNumber) {
      console.error('Missing Twilio credentials')
      throw new Error('Missing Twilio credentials')
    }

    const client = new Twilio(accountSid, authToken)

    // Send the message
    console.log('Sending welcome message...')
    const twilioMessage = await client.messages.create({
      body: message,
      to: to,
      from: fromNumber,
    })

    console.log(`Welcome message sent successfully. SID: ${twilioMessage.sid}`)

    return new Response(
      JSON.stringify({ success: true, messageId: twilioMessage.sid }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error sending welcome SMS:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})