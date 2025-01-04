import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Twilio } from 'npm:twilio'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Profile {
  phone_number: string
  first_name: string
  due_date: string
  interests: string
  lifestyle: string
  preferred_notification_time: string
  pregnancy_status: string
  last_period?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get current time in UTC
    const now = new Date()
    const currentHour = now.getUTCHours()
    const currentMinute = now.getUTCMinutes()

    // Find users whose preferred notification time matches current UTC time
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('preferred_notification_time', `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      throw profilesError
    }

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No messages to send at this time' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const twilio = new Twilio(
      Deno.env.get('TWILIO_A2P_ACCOUNT_SID'),
      Deno.env.get('TWILIO_AUTH_TOKEN')
    )

    const messagingServiceSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID')
    const openAiKey = Deno.env.get('OPENAI_API_KEY')

    // Process each profile
    for (const profile of profiles) {
      try {
        let message: string

        if (profile.pregnancy_status === 'expecting') {
          message = await generatePregnancyMessage(profile, openAiKey!)
        } else {
          message = await generateFertilityMessage(profile, openAiKey!)
        }

        // Send message via Twilio
        await twilio.messages.create({
          body: message,
          to: profile.phone_number,
          messagingServiceSid
        })

        console.log(`Successfully sent daily message to ${profile.phone_number}`)
      } catch (error) {
        console.error(`Error processing profile ${profile.phone_number}:`, error)
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Daily messages sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in send-daily-message function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function generatePregnancyMessage(profile: Profile, apiKey: string): Promise<string> {
  const dueDate = new Date(profile.due_date)
  const today = new Date()
  const gestationalAge = 40 - Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7))

  const prompt = `You are Mother Athena, a knowledgeable and caring AI assistant for pregnant women. 
  Create a personalized daily message for ${profile.first_name} who is ${gestationalAge} weeks pregnant.
  Their interests include ${profile.interests} and their lifestyle is described as ${profile.lifestyle}.
  
  Focus on evidence-based medical information and research about:
  1. Fetal development at this stage
  2. Recommended lifestyle adjustments
  3. Environmental considerations
  4. Mental well-being and mindset
  
  Keep the message warm, supportive, and under 320 characters to fit in an SMS.
  Include one specific, actionable tip based on their interests and lifestyle.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are Mother Athena, a knowledgeable and caring AI assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.7,
    }),
  })

  const data = await response.json()
  return data.choices[0].message.content.trim()
}

async function generateFertilityMessage(profile: Profile, apiKey: string): Promise<string> {
  let fertilityInfo = ""
  
  if (profile.last_period) {
    const lastPeriod = new Date(profile.last_period)
    const today = new Date()
    const daysSinceLastPeriod = Math.ceil((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))
    const cycleDay = (daysSinceLastPeriod % 28) + 1
    
    // Calculate fertility window (assuming a 28-day cycle)
    const isFertileWindow = cycleDay >= 11 && cycleDay <= 17
    const isOvulation = cycleDay === 14
    
    fertilityInfo = `Based on your last period, you're on day ${cycleDay} of your cycle. ${
      isFertileWindow ? "You're in your fertile window! This is an optimal time for conception." :
      isOvulation ? "You're likely ovulating today! This is the peak time for conception." :
      "Continue tracking your cycle and maintaining healthy habits."
    }`
  }

  const prompt = `You are Mother Athena, a knowledgeable and caring AI assistant for women trying to conceive.
  Create a personalized daily message for ${profile.first_name} who is trying to get pregnant.
  Their interests include ${profile.interests} and their lifestyle is described as ${profile.lifestyle}.
  
  Current fertility information: ${fertilityInfo}
  
  Focus on evidence-based medical information and research about:
  1. Fertility optimization
  2. Lifestyle factors that impact fertility
  3. Environmental considerations
  4. Mental well-being and stress management
  
  Keep the message warm, supportive, and under 320 characters to fit in an SMS.
  Include one specific, actionable tip based on their interests and lifestyle.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are Mother Athena, a knowledgeable and caring AI assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.7,
    }),
  })

  const data = await response.json()
  return data.choices[0].message.content.trim()
}