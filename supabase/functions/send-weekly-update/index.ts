import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
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
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all profiles
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('*')
    
    if (profilesError) throw profilesError

    // Initialize Twilio
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER')

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Missing Twilio credentials')
    }

    const client = new Twilio(accountSid, authToken)

    // Process each profile
    for (const profile of profiles) {
      try {
        const dueDate = new Date(profile.due_date)
        const today = new Date()
        
        // Calculate weeks of pregnancy
        const gestationalAge = 40 - Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7))
        
        // Skip if pregnancy is complete
        if (gestationalAge > 40) continue

        // Get development info based on weeks
        const getDevelopmentInfo = (weeks: number) => {
          const developments: { [key: number]: string } = {
            4: "Your baby's neural tube is developing into their brain and spinal cord.",
            5: "Tiny buds that will become arms and legs are forming.",
            6: "Your baby's heart begins to beat.",
            7: "Your baby's face is forming, with tiny nostrils visible.",
            8: "Baby's neural pathways in the brain are developing.",
            9: "External genitalia begin to form.",
            10: "Your baby can now make small movements.",
            11: "Baby's bones are starting to harden.",
            12: "Reflexes are developing; baby can now move fingers and toes.",
            13: "Vocal cords are forming.",
            14: "Baby's facial muscles are developing; they can squint and frown.",
            15: "Baby is forming taste buds.",
            16: "Baby can make sucking movements.",
            17: "Baby's skeleton is hardening from cartilage to bone.",
            18: "Baby's ears are in their final position.",
            19: "Vernix (protective coating) covers baby's skin.",
            20: "Baby can hear your voice and other sounds.",
            21: "Baby's eyebrows and eyelids are fully formed.",
            22: "Baby's lips and mouth are more distinct.",
            23: "Baby begins to have regular sleep and wake cycles.",
            24: "Baby's inner ear is fully developed.",
            25: "Baby responds to your voice and touch.",
            26: "Baby's eyes begin to open.",
            27: "Brain tissue and neurons are rapidly developing.",
            28: "Baby can blink and has eyelashes.",
            29: "Baby's muscles and lungs are maturing.",
            30: "Baby's fingernails have grown to fingertips.",
            31: "Baby's brain can control body temperature.",
            32: "Baby's bones fully developed, but skull remains soft.",
            33: "Baby's immune system is developing.",
            34: "Baby's central nervous system is maturing.",
            35: "Most internal systems are well developed.",
            36: "Baby's skin is getting smoother.",
            37: "Baby is practicing breathing movements.",
            38: "Baby's organs are ready for life outside the womb.",
            39: "Baby's brain and lungs continue to mature.",
            40: "Your baby is fully developed and ready to meet you!"
          }
          return developments[weeks] || "Your baby is developing new features every day!"
        }

        // Get weekly tips based on trimester
        const getTrimesterTips = (weeks: number) => {
          if (weeks <= 13) {
            return [
              "Take prenatal vitamins daily",
              "Stay hydrated",
              "Get plenty of rest",
              "Avoid raw or undercooked foods"
            ]
          } else if (weeks <= 26) {
            return [
              "Do Kegel exercises",
              "Stay active with gentle exercise",
              "Monitor your blood pressure",
              "Start planning your nursery"
            ]
          } else {
            return [
              "Practice breathing exercises",
              "Prepare your hospital bag",
              "Monitor baby's movements",
              "Get plenty of sleep while you can"
            ]
          }
        }

        // Get fruit size comparison
        const getFruitSize = (weeks: number) => {
          const fruitSizes: { [key: number]: string } = {
            4: "blueberry", 5: "bean", 6: "large blueberry", 7: "olive",
            8: "grape", 9: "prune", 10: "kumquat", 11: "kiwi",
            12: "lime", 13: "lemon", 14: "apple", 15: "avocado",
            16: "large avocado", 17: "mango", 18: "bell pepper", 19: "cucumber",
            20: "banana", 21: "carrot", 22: "large carrot", 23: "eggplant",
            24: "corn", 25: "cauliflower", 26: "lettuce", 27: "large cauliflower",
            28: "pineapple", 29: "butternut squash", 30: "coconut", 31: "honeydew melon",
            32: "squash", 33: "cantaloupe", 34: "large pineapple", 35: "honeydew",
            36: "papaya", 37: "winter melon", 38: "small watermelon", 39: "pumpkin",
            40: "watermelon"
          }
          return fruitSizes[weeks] || "growing baby"
        }

        // Compose weekly update message
        const weeklyUpdate = `Hi ${profile.first_name}! 👶 Week ${gestationalAge} Update:

Your baby is now the size of a ${getFruitSize(gestationalAge)}!

Key Development:
${getDevelopmentInfo(gestationalAge)}

Tips for this week:
${getTrimesterTips(gestationalAge).map(tip => `• ${tip}`).join('\n')}

Remember, I'm here 24/7 to answer your pregnancy questions! If you experience any concerning symptoms, please contact your healthcare provider.

- Mother Athena 🤰`

        // Send message via Twilio
        await client.messages.create({
          body: weeklyUpdate,
          to: profile.phone_number,
          from: fromNumber,
        })

        console.log(`Sent weekly update to ${profile.first_name} (Week ${gestationalAge})`)
      } catch (error) {
        console.error(`Error processing profile ${profile.first_name}:`, error)
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in send-weekly-update function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})