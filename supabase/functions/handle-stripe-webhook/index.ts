import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  
  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
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

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const subscriptionId = session.subscription
        const phone_number = session.metadata.phone_number
        
        // Get subscription details to determine the plan type
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = subscription.items.data[0].price.id
        
        const subscriptionType = priceId === Deno.env.get('STRIPE_PRICE_ID')
          ? 'credits_50'
          : 'unlimited'

        // Update profile with subscription details
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_id: subscriptionId,
            subscription_status: 'active',
            subscription_type: subscriptionType,
            next_billing_date: new Date(subscription.current_period_end * 1000).toISOString()
          })
          .eq('phone_number', phone_number)

        if (error) {
          console.error('Error updating profile:', error)
          throw error
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
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400 }
    )
  }
})