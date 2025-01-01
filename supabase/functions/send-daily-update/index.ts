import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Twilio } from 'npm:twilio';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    // Get all users who should receive updates at this time
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('subscription_status', 'active')
      .eq('preferred_notification_time', currentTime);

    if (profilesError) throw profilesError;

    const accountSid = Deno.env.get('TWILIO_A2P_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const messagingServiceSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID');

    if (!accountSid || !authToken || !messagingServiceSid) {
      throw new Error('Missing Twilio credentials');
    }

    const client = new Twilio(accountSid, authToken);

    for (const profile of profiles || []) {
      try {
        // Calculate weeks of pregnancy
        const dueDate = new Date(profile.due_date);
        const today = new Date();
        const pregnancyStart = new Date(dueDate);
        pregnancyStart.setDate(pregnancyStart.getDate() - 280); // 40 weeks
        const weeksPregant = Math.floor((today.getTime() - pregnancyStart.getTime()) / (1000 * 60 * 60 * 24 * 7));

        // Generate personalized message based on user data
        let message = `Hi ${profile.first_name}! Week ${weeksPregant} update from Mother Athena:\n\n`;
        
        // Add development info based on week
        message += `Your baby is now the size of a ${getBabySize(weeksPregant)}. `;
        
        // Add personalized tip based on interests
        if (profile.interests === 'nutrition') {
          message += `\n\nNutrition tip: Consider adding more ${getPregnancyFoods(weeksPregant)} to your diet this week.`;
        } else if (profile.interests === 'exercise') {
          message += `\n\nExercise tip: ${getExerciseTip(weeksPregant, profile.lifestyle)}`;
        }

        // Add local context if available
        if (profile.city) {
          message += `\n\nLocal tip for ${profile.city}: ${getLocalTip(profile.city, weeksPregant)}`;
        }

        await client.messages.create({
          body: message,
          messagingServiceSid: messagingServiceSid,
          to: profile.phone_number
        });

        console.log(`Successfully sent message to ${profile.phone_number}`);
      } catch (error) {
        console.error(`Error sending message to ${profile.phone_number}:`, error);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in daily update function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getBabySize(weeks: number): string {
  const sizes: Record<number, string> = {
    6: "sweet pea",
    7: "blueberry",
    8: "raspberry",
    9: "olive",
    10: "prune",
    11: "lime",
    12: "plum",
    13: "peach",
    // ... Add more sizes as needed
  };
  return sizes[weeks] || "growing baby";
}

function getPregnancyFoods(weeks: number): string {
  const foods: Record<number, string> = {
    6: "leafy greens rich in folate",
    7: "protein-rich foods like lean meats and legumes",
    8: "calcium-rich foods like yogurt and cheese",
    9: "iron-rich foods like spinach and lean red meat",
    // ... Add more foods as needed
  };
  return foods[weeks] || "a variety of nutritious whole foods";
}

function getExerciseTip(weeks: number, lifestyle: string): string {
  const tips: Record<number, string> = {
    6: "Gentle walking and prenatal yoga can help with early pregnancy symptoms",
    7: "Swimming is a great low-impact exercise that's safe throughout pregnancy",
    8: "Try pregnancy-safe stretching exercises to maintain flexibility",
    9: "Regular walking for 20-30 minutes can help with energy levels",
    // ... Add more tips as needed
  };
  return tips[weeks] || "Remember to stay active while listening to your body";
}

function getLocalTip(city: string, weeks: number): string {
  return `Check with your local healthcare provider for pregnancy classes and support groups in your area.`;
}