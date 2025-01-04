import twilio from 'npm:twilio'

export async function sendTwilioResponse(message: string, to: string): Promise<string> {
  console.log('Initializing Twilio with credentials...')
  
  const accountSid = Deno.env.get('TWILIO_A2P_ACCOUNT_SID')
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
  const messagingServiceSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID')

  if (!accountSid || !authToken || !messagingServiceSid) {
    console.error('Missing Twilio credentials:', {
      hasAccountSid: !!accountSid,
      hasAuthToken: !!authToken,
      hasMessagingServiceSid: !!messagingServiceSid
    })
    throw new Error('Missing required Twilio credentials')
  }

  try {
    console.log('Creating Twilio client...')
    const client = twilio(accountSid, authToken)
    
    // Ensure phone number is in E.164 format
    const formattedPhone = to.startsWith('+') ? to : `+${to.replace(/\D/g, '')}`
    console.log('Sending message to:', formattedPhone)
    
    const twilioMessage = await client.messages.create({
      body: message,
      messagingServiceSid,
      to: formattedPhone
    })

    console.log('Message sent successfully:', twilioMessage.sid)
    return twilioMessage.sid
  } catch (error) {
    console.error('Twilio error:', error)
    throw new Error(`Failed to send SMS: ${error.message}`)
  }
}