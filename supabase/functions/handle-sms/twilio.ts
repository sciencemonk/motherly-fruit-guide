import { Twilio } from 'npm:twilio';

export async function sendTwilioResponse(message: string, to: string): Promise<string> {
  const accountSid = Deno.env.get('TWILIO_A2P_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const messagingServiceSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID');

  if (!accountSid || !authToken || !messagingServiceSid) {
    console.error('Missing Twilio credentials:', {
      hasAccountSid: !!accountSid,
      hasAuthToken: !!authToken,
      hasMessagingServiceSid: !!messagingServiceSid
    });
    throw new Error('Missing Twilio credentials');
  }

  console.log('Initializing Twilio client...');
  const client = new Twilio(accountSid, authToken);
  
  console.log('Sending Twilio message to:', to);
  const twilioMessage = await client.messages.create({
    body: message,
    to: to,
    messagingServiceSid: messagingServiceSid,
  });

  console.log('Response sent successfully:', twilioMessage.sid);
  return twilioMessage.sid;
}