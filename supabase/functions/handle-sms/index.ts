import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Twilio } from 'npm:twilio'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { Body, From } = await req.json()
    
    console.log('Received message:', Body, 'from:', From)

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('Missing OpenAI API key')
    }

    // Get AI response
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are Mother Athena, a knowledgeable and compassionate AI pregnancy specialist. 
            Your role is to provide helpful, accurate information about pregnancy while always reminding users 
            to consult healthcare professionals for medical advice. Keep responses concise and friendly.
            If you detect any emergency situations, ALWAYS advise immediate medical attention.`
          },
          {
            role: 'user',
            content: Body
          }
        ],
        max_tokens: 300,
      }),
    })

    const aiData = await aiResponse.json()
    const responseMessage = aiData.choices[0].message.content

    // Send response via Twilio
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER')

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Missing Twilio credentials')
    }

    const client = new Twilio(accountSid, authToken)
    
    const twilioMessage = await client.messages.create({
      body: responseMessage,
      to: From,
      from: fromNumber,
    })

    console.log('Response sent successfully:', twilioMessage.sid)

    return new Response(
      JSON.stringify({ success: true, messageId: twilioMessage.sid }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error handling SMS:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})