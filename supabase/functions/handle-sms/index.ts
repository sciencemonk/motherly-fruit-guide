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
    return new Response('', { 
      status: 200,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
      }
    })
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    console.log('Non-POST request received')
    return new Response(
      JSON.stringify({ message: 'Method not allowed' }),
      { 
        status: 405,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
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
        JSON.stringify({ message: 'Missing required fields' }),
        { 
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // Check OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      console.error('OpenAI API key not found')
      return new Response(
        JSON.stringify({ message: 'Configuration error' }),
        { 
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
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
      JSON.stringify({ message: 'Message received' }),
      { 
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { 
        status: 200, // Still return 200 for Twilio
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
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
    // Get AI response
    let response = await getAIResponse(
      message.Body,
      systemPromptTemplate(hasMedicalConcern),
      openAIApiKey
    )

    // Add medical disclaimer if needed
    if (hasMedicalConcern) {
      response += "\n\n⚠️ IMPORTANT: If you're experiencing concerning symptoms, please contact your healthcare provider immediately or go to the nearest emergency room. Your and your baby's health and safety are the top priority."
    }

    // Send response via Twilio
    await sendTwilioResponse(response, message.From)
    
  } catch (error) {
    console.error('Error in async message processing:', error)
    console.error('Error stack:', error.stack)
  }
}