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
  // Ensure the success URL includes the phone number parameter
  const encodedPhone = encodeURIComponent(phoneNumber);
  const defaultSuccessUrl = `${window.location.origin}/welcome?phone=${encodedPhone}`;
  
  const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
    'create-checkout',
    {
      body: { 
        phone_number: phoneNumber,
        trial,
        success_url: successUrl || defaultSuccessUrl,
        cancel_url: cancelUrl || window.location.origin,
        product_id: 'prod_RVHzCMiLrCYtzk'
      }
    }
  );

  if (checkoutError) {
    console.error('Error creating checkout session:', checkoutError);
    throw checkoutError;
  }

  return checkoutData;
};