import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as twilio from 'npm:twilio@4.19.0'
import { corsHeaders, Profile } from './types.ts'
import { generatePregnancyMessage, generateFertilityMessage } from './message-generator.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting daily message function...');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get current time in UTC
    const now = new Date()
    const currentHour = now.getUTCHours()
    const currentMinute = now.getUTCMinutes()
    
    console.log(`Current UTC time: ${currentHour}:${currentMinute}`);

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
      console.log('No messages to send at this time');
      return new Response(
        JSON.stringify({ message: 'No messages to send at this time' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${profiles.length} profiles to send messages to`);

    const accountSid = Deno.env.get('TWILIO_A2P_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const messagingServiceSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID');
    const openAiKey = Deno.env.get('OPENAI_API_KEY');

    if (!accountSid || !authToken || !messagingServiceSid || !openAiKey) {
      throw new Error('Missing required environment variables');
    }

    const twilioClient = new twilio.Twilio(accountSid, authToken);

    // Process each profile
    for (const profile of profiles) {
      try {
        console.log(`Processing profile for ${profile.phone_number}`);
        
        let message: string

        if (profile.pregnancy_status === 'expecting') {
          message = await generatePregnancyMessage(profile, openAiKey)
        } else {
          message = await generateFertilityMessage(profile, openAiKey)
        }

        // Send message via Twilio
        await twilioClient.messages.create({
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