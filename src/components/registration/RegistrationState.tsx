import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useRegistrationSubmit() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (formData: {
    firstName: string;
    phone: string;
    city: string;
    state: string;
    dueDate: Date;
    interests: string;
    preferredTime: string;
    smsConsent: boolean;
  }) => {
    const { firstName, phone, city, state, dueDate, interests, preferredTime, smsConsent } = formData;
    
    if (!smsConsent) {
      toast({
        variant: "destructive",
        title: "Consent Required",
        description: "Please agree to receive SMS messages to continue.",
      });
      return;
    }

    setIsLoading(true);
    console.log('Starting registration process for:', { phone, firstName });

    try {
      // Generate login code
      console.log('Generating login code...');
      const { data: loginCode, error: loginCodeError } = await supabase
        .rpc('generate_alphanumeric_code', {
          length: 6
        });

      if (loginCodeError) {
        console.error('Login code generation error:', loginCodeError);
        throw loginCodeError;
      }

      console.log('Generated login code successfully');

      // Create new profile with trial status
      console.log('Creating profile...');
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          phone_number: phone,
          first_name: firstName,
          city,
          state,
          due_date: dueDate.toISOString(),
          interests,
          preferred_notification_time: preferredTime,
          subscription_status: 'trial',
          trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          login_code: loginCode
        });

      if (insertError) {
        console.error('Profile creation error:', insertError);
        throw insertError;
      }

      console.log('Profile created successfully, sending welcome message');

      // Send welcome message using handle-sms function
      const response = await supabase.functions.invoke('handle-sms', {
        body: {
          From: process.env.TWILIO_PHONE_NUMBER,
          To: phone,
          Body: `Hi ${firstName}! I'm Mother Athena and I'm here to help you grow a healthy baby. I'll send you a message each day along this magical journey. If you ever have a question, like can I eat this?!, just send me a message!\n\nA big part of having a successful pregnancy is to relax... so right now take a deep breath in and slowly exhale. You've got this! ❤️`
        }
      });

      if (response.error) {
        console.error('Welcome message error:', response.error);
        throw response.error;
      }

      console.log('Welcome message sent successfully');
      
      setIsSubmitted(true);
      window.location.href = `/welcome?phone=${encodeURIComponent(phone)}&registration=success`;
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

  return {
    isLoading,
    isSubmitted,
    handleSubmit
  };
}