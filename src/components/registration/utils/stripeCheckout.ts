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
  const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
    'create-checkout',
    {
      body: { 
        phone_number: phoneNumber,
        trial,
        success_url: successUrl,
        cancel_url: cancelUrl,
        product_id: 'prod_RVHzCMiLrCYtzk' // Updated product ID
      }
    }
  );

  if (checkoutError) {
    console.error('Error creating checkout session:', checkoutError);
    throw checkoutError;
  }

  return checkoutData;
};