import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Twilio } from 'npm:twilio'

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

    // Initialize Twilio client with environment variables
    const client = new Twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID'),
      Deno.env.get('TWILIO_AUTH_TOKEN')
    )

    console.log(`Attempting to send SMS to ${to}`)

    // Send the message
    const twilioMessage = await client.messages.create({
      body: message,
      to: to,
      from: Deno.env.get('TWILIO_PHONE_NUMBER'),
    })

    console.log(`Message sent successfully. SID: ${twilioMessage.sid}`)

    return new Response(
      JSON.stringify({ success: true, messageId: twilioMessage.sid }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error sending SMS:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})