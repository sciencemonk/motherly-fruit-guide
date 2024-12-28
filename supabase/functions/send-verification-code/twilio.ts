import twilio from 'npm:twilio';

export async function sendTwilioResponse(message: string, to: string): Promise<string> {
  const accountSid = Deno.env.get('TWILIO_A2P_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

  if (!accountSid || !authToken || !fromNumber) {
    console.error('Missing Twilio credentials:', {
      hasAccountSid: !!accountSid,
      hasAuthToken: !!authToken,
      hasFromNumber: !!fromNumber
    });
    throw new Error('Missing Twilio credentials');
  }

  console.log('Initializing Twilio client...');
  const client = twilio(accountSid, authToken);
  
  console.log('Sending Twilio message to:', to);
  const twilioMessage = await client.messages.create({
    body: message,
    to: to,
    from: fromNumber,
  });

  console.log('Response sent successfully:', twilioMessage.sid);
  return twilioMessage.sid;
}