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

    // Process each profile
    for (const profile of profiles) {
      try {
        // Calculate weeks of pregnancy
        const dueDate = new Date(profile.due_date)
        const today = new Date()
        const gestationalAge = 40 - Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7))

        // Generate personalized message based on user preferences and pregnancy stage
        const message = await generatePersonalizedMessage(profile, gestationalAge)

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

async function generatePersonalizedMessage(profile: Profile, gestationalAge: number): Promise<string> {
  const messageTypes = [
    { type: 'development', weight: profile.interests?.includes("Baby's development") ? 2 : 1 },
    { type: 'exercise', weight: profile.lifestyle?.includes('exercise') ? 2 : 1 },
    { type: 'nutrition', weight: profile.interests?.includes('Nutrition') ? 2 : 1 },
    { type: 'quote', weight: 1 },
    { type: 'tip', weight: 1 }
  ]

  // Weighted random selection of message type
  const totalWeight = messageTypes.reduce((sum, type) => sum + type.weight, 0)
  let random = Math.random() * totalWeight
  let selectedType = messageTypes[0].type
  
  for (const type of messageTypes) {
    if (random <= type.weight) {
      selectedType = type.type
      break
    }
    random -= type.weight
  }

  // Message templates based on type and pregnancy stage
  const messages = {
    development: [
      `Hey ${profile.first_name}! At week ${gestationalAge}, your baby is developing their ${gestationalAge < 13 ? 'vital organs' : gestationalAge < 27 ? 'senses' : 'final features'}. Keep taking good care of yourself! 🌱`,
      `Your little one is growing steadily! This week (${gestationalAge}), they're about the size of a ${gestationalAge < 13 ? 'lime' : gestationalAge < 27 ? 'mango' : 'watermelon'}. 🍎`,
    ],
    exercise: [
      "Time for some gentle movement! Try prenatal yoga or a short walk today. Remember to listen to your body and stay hydrated! 🧘‍♀️",
      "Exercise tip: Swimming is a great low-impact workout during pregnancy. It helps reduce swelling and supports your growing belly! 🏊‍♀️",
    ],
    nutrition: [
      "Nutrition reminder: Include folate-rich foods like leafy greens in your meals today. Your baby needs these nutrients for healthy development! 🥗",
      "Craving something sweet? Try some fresh fruits! They are packed with vitamins and natural sugars your body needs. 🍎",
    ],
    quote: [
      "A mother's joy begins when new life is stirring inside... when a tiny heartbeat is heard for the very first time, and a playful kick reminds her that she is never alone. 💝",
      "Pregnancy is the only time when you can do nothing and still be productive! Keep growing that little miracle! ✨",
    ],
    tip: [
      "Remember to take your prenatal vitamins and stay hydrated today! Small actions make a big difference. 💪",
      "Take a moment to connect with your baby today. Put your hand on your belly and take some deep breaths. 🫂",
    ],
  }

  // Select random message from appropriate category
  const categoryMessages = messages[selectedType as keyof typeof messages]
  const selectedMessage = categoryMessages[Math.floor(Math.random() * categoryMessages.length)]

  return selectedMessage
}