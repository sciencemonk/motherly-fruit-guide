import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { phone_number, price_option } = await req.json()
    
    if (!phone_number) {
      throw new Error('Phone number is required')
    }

    if (!price_option || (price_option !== '1' && price_option !== '2')) {
      throw new Error('Valid price option (1 or 2) is required')
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    console.log('Creating checkout session for phone:', phone_number, 'with price option:', price_option)
    
    // Get the correct price ID based on the selected option
    const priceId = price_option === '1' 
      ? Deno.env.get('STRIPE_PRICE_ID')  // 50 credits for $49/month
      : Deno.env.get('STRIPE_PRICE_ID_2') // Unlimited for $79/month

    if (!priceId) {
      console.error('Price ID not configured:', { 
        option: price_option, 
        priceId1: Deno.env.get('STRIPE_PRICE_ID'),
        priceId2: Deno.env.get('STRIPE_PRICE_ID_2')
      });
      throw new Error('Price ID not configured')
    }

    console.log('Using price ID:', priceId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/?success=true`,
      cancel_url: `${req.headers.get('origin')}/?canceled=true`,
      metadata: {
        phone_number: phone_number,
      },
    })

    console.log('Checkout session created:', session.id)
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})