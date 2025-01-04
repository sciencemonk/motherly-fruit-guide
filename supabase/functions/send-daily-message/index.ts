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
    console.log(`Current UTC time: ${now.toISOString()}`);
    
    // Format current hour and minute for comparison
    const currentHour = now.getUTCHours()
    const currentMinute = now.getUTCMinutes()
    const currentTimeFormatted = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
    
    console.log(`Formatted current time for comparison: ${currentTimeFormatted}`);

    // Find eligible users (either premium or within trial period)
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('*')
      .not('preferred_notification_time', 'is', null)
      .or(`is_premium.eq.true,trial_ends_at.gt.${now.toISOString()}`)

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

    // Filter profiles based on notification time
    const profilesToNotify = profiles.filter(profile => {
      const preferredTime = profile.preferred_notification_time?.slice(0, 5); // Get HH:MM format
      const shouldNotify = preferredTime === currentTimeFormatted;
      
      console.log(`Profile ${profile.phone_number}:
        Preferred time: ${preferredTime}
        Current time: ${currentTimeFormatted}
        Premium: ${profile.is_premium}
        Trial ends: ${profile.trial_ends_at}
        Should notify: ${shouldNotify}`
      );
      
      return shouldNotify;
    });

    if (profilesToNotify.length === 0) {
      console.log(`No messages to send at current time (${currentTimeFormatted})`);
      return new Response(
        JSON.stringify({ message: `No messages to send at current time (${currentTimeFormatted})` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${profilesToNotify.length} profiles to notify at ${currentTimeFormatted}`);

    // Verify required environment variables
    const requiredEnvVars = {
      accountSid: Deno.env.get('TWILIO_A2P_ACCOUNT_SID'),
      authToken: Deno.env.get('TWILIO_AUTH_TOKEN'),
      messagingServiceSid: Deno.env.get('TWILIO_MESSAGING_SERVICE_SID'),
      openAiKey: Deno.env.get('OPENAI_API_KEY')
    };

    const missingEnvVars = Object.entries(requiredEnvVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingEnvVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }

    const twilioClient = new twilio.Twilio(
      requiredEnvVars.accountSid!,
      requiredEnvVars.authToken!
    );

    // Process each profile
    const results = [];
    for (const profile of profilesToNotify) {
      try {
        console.log(`Processing profile for ${profile.phone_number}:
          Pregnancy status: ${profile.pregnancy_status}
          Interests: ${profile.interests}
          Lifestyle: ${profile.lifestyle}`
        );
        
        // Generate personalized message
        const message = profile.pregnancy_status === 'expecting'
          ? await generatePregnancyMessage(profile as Profile, requiredEnvVars.openAiKey!)
          : await generateFertilityMessage(profile as Profile, requiredEnvVars.openAiKey!);

        console.log(`Generated message for ${profile.phone_number}:`, message);

        // Send message via Twilio
        const twilioResponse = await twilioClient.messages.create({
          body: message,
          to: profile.phone_number,
          messagingServiceSid: requiredEnvVars.messagingServiceSid
        });

        console.log(`Successfully sent message to ${profile.phone_number}, SID: ${twilioResponse.sid}`);
        
        // Record message in chat history
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

        results.push({ 
          phone: profile.phone_number, 
          status: 'success', 
          sid: twilioResponse.sid 
        });

      } catch (error) {
        console.error(`Error processing profile ${profile.phone_number}:`, error);
        results.push({ 
          phone: profile.phone_number, 
          status: 'error', 
          error: error.message 
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        timestamp: now.toISOString(),
        currentTime: currentTimeFormatted
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in send-daily-message function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})