import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Twilio } from 'npm:twilio'

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
    })
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const { to, message } = await req.json();
    console.log('Received request to send SMS to:', to);

    if (!to || !message) {
      throw new Error('Missing required fields: to and message');
    }

    // Get A2P-specific Twilio credentials
    const accountSid = Deno.env.get('TWILIO_A2P_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_A2P_AUTH_TOKEN');
    const messagingServiceSid = 'MG1fa945c66e3013f6a9b3ad77bf8a05e4'; // Your A2P Messaging Service SID

    // Add detailed logging for debugging
    console.log('Checking A2P Twilio credentials...');
    console.log('A2P Account SID exists:', !!accountSid);
    console.log('A2P Auth Token exists:', !!authToken);
    console.log('A2P Messaging Service SID:', messagingServiceSid);

    if (!accountSid || !authToken) {
      console.error('Missing A2P Twilio credentials');
      throw new Error('Missing A2P Twilio credentials');
    }

    console.log('Initializing Twilio client with A2P credentials...');
    const client = new Twilio(accountSid, authToken);

    // Ensure the phone number is in E.164 format
    const formattedPhone = to.startsWith('+') ? to : `+${to.replace(/\D/g, '')}`;
    console.log('Formatted phone number:', formattedPhone);

    // Send the message using the A2P messaging service
    console.log('Attempting to send SMS via A2P campaign...');
    const twilioMessage = await client.messages.create({
      body: message,
      to: formattedPhone,
      messagingServiceSid: messagingServiceSid // Use the A2P Messaging Service SID
    });

    console.log('SMS sent successfully:', twilioMessage.sid);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: twilioMessage.sid 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in send-welcome-sms function:', error);
    
    // Add more detailed error information
    const errorResponse = {
      error: error.message || 'Internal server error',
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo,
      details: error.toString(),
      timestamp: new Date().toISOString()
    };
    
    return new Response(
      JSON.stringify(errorResponse),
      { 
        status: error.status || 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
})