import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationData {
  firstName: string;
  phone: string;
  wakeTime: string;
  sleepTime: string;
  smsConsent: boolean;
  setIsLoading: (loading: boolean) => void;
  setIsSubmitted: (submitted: boolean) => void;
}

export function useRegistrationSubmit() {
  const { toast } = useToast();

  const handleSubmit = async ({
    firstName,
    phone,
    smsConsent,
    wakeTime,
    sleepTime,
    setIsLoading,
    setIsSubmitted
  }: RegistrationData) => {
    if (!firstName || !phone) {
      toast({
        variant: "destructive",
        title: "Please fill in all fields",
        description: "We need this information to support you during your journey.",
      });
      return;
    }

    if (!smsConsent) {
      toast({
        variant: "destructive",
        title: "SMS Consent Required",
        description: "Please agree to receive text messages to continue.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Generate a 6-digit numeric code
      const loginCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Format phone number by removing non-digit characters and ensuring + prefix
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone.replace(/\D/g, '')}`;
      console.log('Formatted phone number:', formattedPhone);

      // First try to update existing profile
      const { data: updateResult, error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          login_code: loginCode,
          reality_check_start_time: wakeTime,
          reality_check_end_time: sleepTime,
          trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('phone_number', formattedPhone)
        .select();

      // If no profile was updated (i.e., doesn't exist), create a new one
      if (!updateResult || updateResult.length === 0) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            phone_number: formattedPhone,
            first_name: firstName,
            login_code: loginCode,
            reality_check_start_time: wakeTime,
            reality_check_end_time: sleepTime,
            trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          });

        if (insertError) {
          console.error('Error storing profile:', insertError);
          throw insertError;
        }
      } else if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }

      // Send first message using handle-sms endpoint
      try {
        const response = await fetch('https://tjeukbooftbxulkgqljg.supabase.co/functions/v1/handle-sms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: formattedPhone,
            Body: 'Hello'
          }).toString()
        });

        if (!response.ok) {
          console.error('Welcome message failed:', await response.text());
        } else {
          console.log('Welcome message sent successfully');
        }
      } catch (error) {
        console.error('Error sending welcome message:', error);
      }

      toast({
        title: "Welcome to Morpheus!",
        description: "Check your phone for your login code.",
      });
      
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Registration error",
        description: error.message || "There was a problem with your registration. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit };
}