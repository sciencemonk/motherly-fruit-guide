import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { corsHeaders, medicalKeywords, systemPromptTemplate } from './constants.ts'
import { TwilioMessage } from './types.ts'
import { getAIResponse } from './openai.ts'
import { sendTwilioResponse } from './twilio.ts'

console.log('Edge Function loaded and running')

serve(async (req) => {
  // Log every incoming request immediately
  console.log('----------------------------------------')
  console.log('Edge Function triggered at:', new Date().toISOString())
  console.log('Incoming request to handle-sms function')
  console.log('Request URL:', req.url)
  console.log('Request method:', req.method)
  console.log('Request headers:', Object.fromEntries(req.headers.entries()))

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response('ok', { 
      status: 200,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'text/plain',
      }
    })
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    console.log('Non-POST request received')
    return new Response(
      'Method not allowed',
      { 
        status: 200, // Return 200 for Twilio
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain'
        }
      }
    )
  }

  try {
    // Parse the incoming webhook
    const body = await req.text()
    console.log('Raw request body:', body)
    
    const formData = new URLSearchParams(body)
    const messageData: TwilioMessage = {
      Body: formData.get('Body') || '',
      From: formData.get('From') || ''
    }
    
    console.log('Parsed message:', messageData)

    // Validate required fields
    if (!messageData.Body || !messageData.From) {
      console.error('Missing required fields in request')
      return new Response(
        'Missing required fields',
        { 
          status: 200, // Return 200 for Twilio
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/plain'
          }
        }
      )
    }

    // Check OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      console.error('OpenAI API key not found')
      return new Response(
        'Configuration error',
        { 
          status: 200, // Return 200 for Twilio
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/plain'
          }
        }
      )
    }

    // Check for medical concerns
    const hasMedicalConcern = medicalKeywords.some(keyword => 
      messageData.Body.toLowerCase().includes(keyword)
    )

    // Process message asynchronously
    processMessage(messageData, hasMedicalConcern, openAIApiKey)

    // Return immediate success response for Twilio
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
    console.error('Error processing webhook:', error)
    console.error('Error stack:', error.stack)
    return new Response(
      'Internal server error',
      { 
        status: 200, // Still return 200 for Twilio
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain'
        }
      }
    )
  }
})

async function processMessage(
  message: TwilioMessage,
  hasMedicalConcern: boolean,
  openAIApiKey: string
) {
  try {
    console.log('Processing message:', message)
    
    // Get AI response
    let response = await getAIResponse(
      message.Body,
      systemPromptTemplate(hasMedicalConcern),
      openAIApiKey
    )

    console.log('AI response received:', response)

    // Add medical disclaimer if needed
    if (hasMedicalConcern) {
      response += "\n\n⚠️ IMPORTANT: If you're experiencing concerning symptoms, please contact your healthcare provider immediately or go to the nearest emergency room. Your and your baby's health and safety are the top priority."
    }

    // Send response via Twilio
    await sendTwilioResponse(response, message.From)
    console.log('Response sent successfully to:', message.From)
    
  } catch (error) {
    console.error('Error in async message processing:', error)
    console.error('Error stack:', error.stack)
  }
}