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

      // Check for existing profile
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone_number', formattedPhone)
        .maybeSingle();

      if (profileError) {
        console.error('Error checking profile:', profileError);
        throw profileError;
      }

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            login_code: loginCode,
            reality_check_start_time: wakeTime,
            reality_check_end_time: sleepTime,
            trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('phone_number', formattedPhone);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          throw updateError;
        }
      } else {
        // Create new profile
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
          console.error('Error creating profile:', insertError);
          throw insertError;
        }
      }

      // Send welcome message using handle-sms endpoint
      const welcomeResponse = await fetch('https://tjeukbooftbxulkgqljg.supabase.co/functions/v1/handle-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: formattedPhone,
          Body: 'Hello'
        }).toString()
      });

      if (!welcomeResponse.ok) {
        console.error('Welcome message failed:', await welcomeResponse.text());
        throw new Error('Failed to send welcome message');
      } else {
        console.log('Welcome message sent successfully');
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