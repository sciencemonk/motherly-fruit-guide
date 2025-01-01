import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createCheckoutSession } from "./utils/stripeCheckout";

interface RegistrationData {
  firstName: string;
  phone: string;
  city: string;
  state: string;
  dueDate: Date;
  interests: string;
  lifestyle: string;
  preferredTime: string;
  smsConsent: boolean;
  setIsLoading: (loading: boolean) => void;
  setIsSubmitted: (submitted: boolean) => void;
}

export function useRegistrationSubmit() {
  const { toast } = useToast();

  const handleSubmit = async ({
    firstName,
    phone,
    city,
    state,
    dueDate,
    interests,
    lifestyle,
    preferredTime,
    smsConsent,
    setIsLoading,
    setIsSubmitted
  }: RegistrationData) => {
    if (!firstName || !phone || !city || !dueDate || !interests || !lifestyle || !preferredTime) {
      toast({
        variant: "destructive",
        title: "Please fill in all fields",
        description: "We need this information to support you during your pregnancy journey.",
      });
      return;
    }

    if (!smsConsent) {
      toast({
        variant: "destructive",
        title: "Consent Required",
        description: "Please agree to the terms to start your free trial.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone_number', phone)
        .maybeSingle();

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            city,
            state,
            due_date: dueDate.toISOString(),
            interests,
            lifestyle,
            preferred_notification_time: preferredTime,
          })
          .eq('phone_number', phone);

        if (updateError) throw updateError;
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              phone_number: phone,
              first_name: firstName,
              city,
              state,
              due_date: dueDate.toISOString(),
              interests,
              lifestyle,
              preferred_notification_time: preferredTime,
              subscription_status: 'trial',
              trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            }
          ]);

        if (insertError) throw insertError;
      }

      // Get the current origin for success/cancel URLs
      const origin = window.location.origin;
      const successUrl = `${origin}/?registration=success&phone=${encodeURIComponent(phone)}&firstName=${encodeURIComponent(firstName)}`;
      const cancelUrl = `${origin}/?registration=cancelled`;

      const checkoutData = await createCheckoutSession({
        phoneNumber: phone,
        trial: true,
        successUrl,
        cancelUrl
      });

      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Registration error",
        description: "There was a problem with your registration. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return { handleSubmit };
}