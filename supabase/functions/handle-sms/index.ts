import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from './constants.ts'
import { sendTwilioResponse } from './twilio.ts'

console.log("handle-sms function started")

serve(async (req) => {
  console.log('New request received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  })

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request')
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      }
    })
  }

  try {
    const { message, isPregnancyQuestion } = await req.json()
    
    console.log('Processing request with params:', {
      isPregnancyQuestion,
      messagePreview: message?.substring(0, 50) + '...' // Log first 50 chars for privacy
    })

    if (!message) {
      console.error('No message provided')
      throw new Error('Message is required')
    }

    // For now, just return a simple response
    // TODO: Integrate with OpenAI for actual pregnancy advice
    const response = {
      message: "Thank you for your question. We are processing your request and will provide a detailed response shortly.",
      success: true
    }

    console.log('Sending response:', response)

    return new Response(JSON.stringify(response), {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200,
    })

  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 400,
    })
  }
})