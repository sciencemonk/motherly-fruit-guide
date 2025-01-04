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

    // Process each profile
    for (const profile of profiles) {
      try {
        let message: string

        if (profile.pregnancy_status === 'expecting') {
          // Calculate weeks of pregnancy
          const dueDate = new Date(profile.due_date)
          const today = new Date()
          const gestationalAge = 40 - Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7))
          
          message = await generatePregnancyMessage(profile, gestationalAge)
        } else {
          // For users trying to conceive
          message = await generateFertilityMessage(profile)
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

async function generatePregnancyMessage(profile: Profile, gestationalAge: number): Promise<string> {
  const messageTypes = [
    { type: 'development', weight: profile.interests?.includes("Baby's development") ? 2 : 1 },
    { type: 'lifestyle', weight: profile.lifestyle?.includes('active') ? 2 : 1 },
    { type: 'mindset', weight: profile.interests?.includes('Mental health') ? 2 : 1 },
    { type: 'environment', weight: 1 }
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
    lifestyle: [
      `${profile.first_name}, maintaining an ${profile.lifestyle} lifestyle is great for your baby! Remember to stay hydrated and get some gentle movement today. 💪`,
      `Your healthy choices matter! Consider trying some prenatal yoga or a short walk to support your wellbeing today. 🧘‍♀️`,
    ],
    mindset: [
      `Take a moment for yourself today, ${profile.first_name}. A positive mindset supports both you and your baby's development. ✨`,
      `Remember to breathe deeply and connect with your baby today. Your emotional wellbeing is just as important as physical health. 🫂`,
    ],
    environment: [
      `Creating a nurturing environment is key! Today, try to spend some time in nature or create a calm space at home. 🌿`,
      `Your environment affects your baby's development. Consider adding some calming elements to your daily routine. 🏡`,
    ],
  }

  const categoryMessages = messages[selectedType as keyof typeof messages]
  return categoryMessages[Math.floor(Math.random() * categoryMessages.length)]
}

async function generateFertilityMessage(profile: Profile): Promise<string> {
  const messageTypes = [
    { type: 'cycle', weight: 2 },
    { type: 'lifestyle', weight: profile.lifestyle?.includes('active') ? 2 : 1 },
    { type: 'mindset', weight: profile.interests?.includes('Mental health') ? 2 : 1 },
    { type: 'environment', weight: 1 }
  ]

  // Weighted random selection
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

  const messages = {
    cycle: [
      `${profile.first_name}, tracking your cycle is key to understanding your fertility. Remember to note any changes in your body today. 📝`,
      `Stay in tune with your body's natural rhythm. Every cycle brings new opportunities for conception. 🌙`,
    ],
    lifestyle: [
      `Your ${profile.lifestyle} lifestyle choices support your fertility journey! Keep up the great work, ${profile.first_name}. 💪`,
      `Small daily habits can make a big difference. Focus on nourishing your body with healthy foods and gentle movement today. 🥗`,
    ],
    mindset: [
      `${profile.first_name}, maintain a positive mindset on your fertility journey. Each day is a step forward. ✨`,
      `Take time for self-care today. Your emotional wellbeing is an important part of your fertility journey. 🫂`,
    ],
    environment: [
      `Creating a supportive environment helps your fertility journey. Consider ways to reduce stress in your surroundings today. 🌿`,
      `Your environment plays a role in fertility. Try to create moments of peace in your daily routine. 🏡`,
    ],
  }

  const categoryMessages = messages[selectedType as keyof typeof messages]
  return categoryMessages[Math.floor(Math.random() * categoryMessages.length)]
}