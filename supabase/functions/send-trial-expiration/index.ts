import { createClient } from 'npm:@supabase/supabase-js'
import { Twilio } from 'npm:twilio'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const accountSid = Deno.env.get('TWILIO_A2P_ACCOUNT_SID')!
const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')!
const messagingServiceSid = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID')!
const stripeLink = 'https://buy.stripe.com/your_product_link' // Replace with your actual Stripe payment link

const client = new Twilio(accountSid, authToken)

Deno.serve(async (req) => {
  try {
    // Get profiles where trial is ending in the next 24 hours
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('phone_number, first_name')
      .eq('subscription_status', 'trial')
      .lt('trial_ends_at', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
      .gt('trial_ends_at', new Date().toISOString())

    if (error) throw error

    // Send messages to users
    for (const profile of profiles || []) {
      try {
        await client.messages.create({
          body: `Hi ${profile.first_name}! Your free trial of Mother Athena is ending soon. To continue receiving unlimited support and daily pregnancy guidance, upgrade now: ${stripeLink}`,
          to: profile.phone_number,
          messagingServiceSid
        })

        console.log(`Trial expiration message sent to ${profile.phone_number}`)
      } catch (error) {
        console.error(`Error sending trial expiration message to ${profile.phone_number}:`, error)
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in trial expiration function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})