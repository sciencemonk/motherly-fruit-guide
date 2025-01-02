import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('stripe-signature')
  
    if (!signature) {
      return new Response('No signature', { status: 400 })
    }

    const body = await req.text()
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET') || ''
    )

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Processing webhook event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const subscriptionId = session.subscription
        const phone_number = session.metadata.phone_number
        
        console.log('Checkout completed for phone:', phone_number)
        
        // Get subscription details to determine the plan type
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = subscription.items.data[0].price.id
        
        const subscriptionType = priceId === Deno.env.get('STRIPE_PRICE_ID')
          ? 'credits_50'
          : 'unlimited'

        // Get user profile to get first name
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('phone_number', phone_number)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError)
          throw profileError
        }

        // Update profile with subscription details
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_id: subscriptionId,
            subscription_status: 'active',
            subscription_type: subscriptionType,
            next_billing_date: new Date(subscription.current_period_end * 1000).toISOString()
          })
          .eq('phone_number', phone_number)

        if (updateError) {
          console.error('Error updating profile:', updateError)
          throw updateError
        }

        // Send welcome message using direct HTTP request to the edge function
        try {
          console.log('Sending welcome message for:', phone_number)
          const welcomeMessage = `Hi ${profile.first_name}! I'm Mother Athena and I'm here to help you grow a healthy baby. I'll send you a message each day along this magical journey. If you ever have a question, like can I eat this?!, just send me a message!\n\nA big part of having a successful pregnancy is to relax... so right now take a deep breath in and slowly exhale. You've got this! ❤️`
          
          // Construct the full URL for the edge function
          const projectUrl = Deno.env.get('SUPABASE_URL')
          const functionUrl = `${projectUrl}/functions/v1/send-welcome-sms`
          
          console.log('Calling edge function at:', functionUrl)
          
          const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            },
            body: JSON.stringify({
              to: phone_number,
              message: welcomeMessage
            })
          })

          const responseText = await response.text()
          console.log('Edge function response:', responseText)

          if (!response.ok) {
            throw new Error(`Failed to send welcome message: ${responseText}`)
          }

          console.log('Welcome message sent successfully')
        } catch (error) {
          console.error('Error sending welcome message:', error)
          // Log the error but don't throw, as we don't want to fail the webhook
          // This ensures the subscription is still processed even if the message fails
        }

        break
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_status: subscription.status,
            next_billing_date: new Date(subscription.current_period_end * 1000).toISOString()
          })
          .eq('subscription_id', subscription.id)

        if (error) {
          console.error('Error updating subscription status:', error)
          throw error
        }

        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'inactive',
            subscription_type: null,
            subscription_id: null,
            next_billing_date: null
          })
          .eq('subscription_id', subscription.id)

        if (error) {
          console.error('Error updating subscription status:', error)
          throw error
        }

        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})