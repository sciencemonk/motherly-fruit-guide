import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Twilio } from 'npm:twilio'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('Edge Function loaded and running')

serve(async (req) => {
  // Log every incoming request immediately
  console.log('----------------------------------------')
  console.log('Edge Function triggered at:', new Date().toISOString())
  console.log('Incoming request to handle-sms function')
  console.log('Request URL:', req.url)
  console.log('Request method:', req.method)
  console.log('Request headers:', Object.fromEntries(req.headers.entries()))
  
  // Log the raw URL and search params for debugging
  const url = new URL(req.url)
  console.log('URL pathname:', url.pathname)
  console.log('URL search params:', Object.fromEntries(url.searchParams.entries()))
  
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = await req.text()
    console.log('Raw request body:', body)
    
    // Try to parse the body as URL-encoded form data (Twilio's format)
    const formData = new URLSearchParams(body)
    console.log('Parsed form data entries:', Object.fromEntries(formData.entries()))
    
    const Body = formData.get('Body')
    const From = formData.get('From')
    
    console.log('Parsed message:', { Body, From })

    if (!Body || !From) {
      console.error('Missing required fields in request')
      throw new Error('Missing Body or From field in request')
    }
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment variables')
      throw new Error('Missing OpenAI API key')
    }

    // Check for medical concerns
    const medicalKeywords = ['pain', 'hurt', 'blood', 'bleeding', 'cramp', 'dizzy', 'headache', 'emergency', 'hospital']
    const hasMedicalConcern = medicalKeywords.some(keyword => 
      Body.toLowerCase().includes(keyword)
    )

    let systemPrompt = `You are Mother Athena, a knowledgeable and compassionate AI pregnancy specialist with expertise in obstetrics and gynecology. 
    Your responses should be:
    1. Evidence-based and aligned with current medical best practices
    2. Warm, encouraging, and supportive
    3. Clear and easy to understand
    4. Always emphasizing the importance of consulting healthcare providers for medical concerns
    
    Key guidelines:
    - Use a friendly, caring tone
    - Provide specific, actionable advice when appropriate
    - Acknowledge the emotional aspects of pregnancy
    - Always encourage users to enjoy their pregnancy journey while staying informed
    - If any medical concerns are mentioned, strongly advise consulting a healthcare provider
    
    Current message medical concern detected: ${hasMedicalConcern}`

    // Get AI response
    console.log('Fetching response from OpenAI...')
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: Body
          }
        ],
        max_tokens: 300,
      }),
    })

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json()
      console.error('OpenAI API error:', errorData)
      throw new Error('Failed to get AI response')
    }

    const aiData = await aiResponse.json()
    console.log('Received OpenAI response:', aiData)
    let responseMessage = aiData.choices[0].message.content

    // If medical concerns detected, append emergency disclaimer
    if (hasMedicalConcern) {
      responseMessage += "\n\n⚠️ IMPORTANT: If you're experiencing concerning symptoms, please contact your healthcare provider immediately or go to the nearest emergency room. Your and your baby's health and safety are the top priority."
    }

    // Send response via Twilio
    const accountSid = Deno.env.get('TWILIO_A2P_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const messagingServiceSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID')

    if (!accountSid || !authToken || !messagingServiceSid) {
      console.error('Missing Twilio credentials:', {
        hasAccountSid: !!accountSid,
        hasAuthToken: !!authToken,
        hasMessagingServiceSid: !!messagingServiceSid
      })
      throw new Error('Missing Twilio credentials')
    }

    console.log('Initializing Twilio client...')
    const client = new Twilio(accountSid, authToken)
    
    console.log('Sending Twilio message to:', From)
    const twilioMessage = await client.messages.create({
      body: responseMessage,
      to: From,
      messagingServiceSid: messagingServiceSid,
    })

    console.log('Response sent successfully:', twilioMessage.sid)

    return new Response(
      JSON.stringify({ success: true, messageId: twilioMessage.sid }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error handling SMS:', error)
    console.error('Error stack:', error.stack)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString(),
        errorDetails: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})