import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { corsHeaders, medicalKeywords, systemPromptTemplate } from './constants.ts'
import { TwilioMessage } from './types.ts'
import { getAIResponse } from './openai.ts'
import { sendTwilioResponse } from './twilio.ts'

console.log('Edge Function loaded and running')

// Remove JWT verification to allow public access
serve(async (req) => {
  // Immediate logging of every request
  console.log('----------------------------------------')
  console.log('New request received:', new Date().toISOString())
  console.log('Request method:', req.method)
  console.log('Request headers:', Object.fromEntries(req.headers.entries()))
  
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
    // Log raw request
    const rawBody = await req.text()
    console.log('Raw request body:', rawBody)
    
    // For debugging: Always return a success response to test if Twilio can reach the endpoint
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