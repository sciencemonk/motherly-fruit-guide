import { supabase } from "@/integrations/supabase/client";

interface CheckoutOptions {
  phoneNumber: string;
  trial: boolean;
  successUrl: string;
  cancelUrl: string;
}

export const createCheckoutSession = async ({ 
  phoneNumber, 
  trial, 
  successUrl, 
  cancelUrl 
}: CheckoutOptions) => {
  // Get the current origin for success/cancel URLs
  const origin = window.location.origin;
  
  // Ensure the success URL includes the phone parameter
  const encodedPhone = encodeURIComponent(phoneNumber);
  const defaultSuccessUrl = `${origin}/welcome?phone=${encodedPhone}&registration=success`;
  const defaultCancelUrl = `${origin}/?registration=cancelled`;
  
  console.log('Creating checkout with success URL:', successUrl || defaultSuccessUrl); // Debug log
  
  const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
    'create-checkout',
    {
      body: { 
        phone_number: phoneNumber,
        trial,
        success_url: successUrl || defaultSuccessUrl,
        cancel_url: cancelUrl || defaultCancelUrl,
        product_id: 'prod_RVHzCMiLrCYtzk'
      }
    }
  );

  if (checkoutError) {
    console.error('Error creating checkout session:', checkoutError);
    throw checkoutError;
  }

  console.log('Checkout session created:', checkoutData); // Debug log
  return checkoutData;
};