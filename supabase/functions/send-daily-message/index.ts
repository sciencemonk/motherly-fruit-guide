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
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
    
    console.log(`Current UTC time: ${currentTime}`);

    // Find users who should receive messages
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('*')
      .not('preferred_notification_time', 'is', null)
      .or(`is_premium.eq.true,and(trial_ends_at.gt.${now.toISOString()})`) // Only get premium users or users in trial

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      throw profilesError
    }

    if (!profiles || profiles.length === 0) {
      console.log('No profiles found with notification preferences');
      return new Response(
        JSON.stringify({ message: 'No profiles found with notification preferences' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${profiles.length} total profiles, checking notification times...`);

    // Filter profiles based on current time
    const profilesToNotify = profiles.filter(profile => {
      const preferredTime = profile.preferred_notification_time?.slice(0, 5); // Get HH:MM format
      console.log(`Checking profile ${profile.phone_number}: preferred time ${preferredTime} vs current time ${currentTime}`);
      return preferredTime === currentTime;
    });

    if (profilesToNotify.length === 0) {
      console.log('No messages to send at this time');
      return new Response(
        JSON.stringify({ message: 'No messages to send at this time' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${profilesToNotify.length} profiles to send messages to`);

    const accountSid = Deno.env.get('TWILIO_A2P_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const messagingServiceSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID');
    const openAiKey = Deno.env.get('OPENAI_API_KEY');

    if (!accountSid || !authToken || !messagingServiceSid || !openAiKey) {
      throw new Error('Missing required environment variables');
    }

    const twilioClient = new twilio.Twilio(accountSid, authToken);

    // Process each profile
    const results = [];
    for (const profile of profilesToNotify) {
      try {
        console.log(`Processing profile for ${profile.phone_number}`);
        
        let message: string;

        if (profile.pregnancy_status === 'expecting') {
          message = await generatePregnancyMessage(profile as Profile, openAiKey);
        } else {
          message = await generateFertilityMessage(profile as Profile, openAiKey);
        }

        // Send message via Twilio
        const twilioResponse = await twilioClient.messages.create({
          body: message,
          to: profile.phone_number,
          messagingServiceSid
        });

        console.log(`Successfully sent daily message to ${profile.phone_number}, SID: ${twilioResponse.sid}`);
        results.push({ phone: profile.phone_number, status: 'success', sid: twilioResponse.sid });

        // Record the message in chat_history
        const { error: chatError } = await supabaseClient
          .from('chat_history')
          .insert({
            phone_number: profile.phone_number,
            role: 'assistant',
            content: message
          });

        if (chatError) {
          console.error(`Error recording chat history for ${profile.phone_number}:`, chatError);
        }

      } catch (error) {
        console.error(`Error processing profile ${profile.phone_number}:`, error);
        results.push({ phone: profile.phone_number, status: 'error', error: error.message });
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in send-daily-message function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})