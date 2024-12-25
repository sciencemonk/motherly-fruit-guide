import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Twilio } from 'npm:twilio'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const { to, message } = await req.json()

    if (!to || !message) {
      throw new Error('Missing required fields: to and message');
    }

    console.log('Attempting to send welcome SMS to:', to);

    // Initialize Twilio client with environment variables
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !fromNumber) {
      console.error('Missing Twilio credentials');
      throw new Error('Missing Twilio credentials');
    }

    const client = new Twilio(accountSid, authToken);

    // Ensure the phone number is in E.164 format
    const formattedPhone = to.startsWith('+') ? to : `+${to.replace(/\D/g, '')}`;
    console.log('Formatted phone number:', formattedPhone);

    // Send the message
    console.log('Sending welcome message...');
    const twilioMessage = await client.messages.create({
      body: message,
      to: formattedPhone,
      from: fromNumber,
    });

    console.log(`Welcome message sent successfully. SID: ${twilioMessage.sid}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: twilioMessage.sid 
      }),
      { 
        status: 200,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error sending welcome SMS:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        status: error.status || 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});