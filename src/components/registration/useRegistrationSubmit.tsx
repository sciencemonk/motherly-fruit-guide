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

  const sendWelcomeMessage = async (phoneNumber: string, firstName: string, loginCode: string) => {
    try {
      console.log('Sending welcome message to:', phoneNumber);
      
      const welcomeMessage = `Welcome to Morpheus, ${firstName}! Your login code is ${loginCode}. You can use this code to access your dashboard. Your free trial will last for 7 days. Text RESET to get a new code if needed.`;

      const { data, error } = await supabase.functions.invoke('send-welcome-sms', {
        body: {
          to: phoneNumber,
          message: welcomeMessage
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        return { success: false, error };
      }

      console.log('Welcome message response:', data);
      return { success: true, data };
    } catch (error) {
      console.error("Error sending welcome message:", error);
      return { success: false, error };
    }
  };

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

      // First try to get the existing profile with proper headers
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone_number', phone)
        .maybeSingle();

      if (profileError) {
        console.error('Error checking profile:', profileError);
        throw profileError;
      }

      let profileResult;

      if (existingProfile) {
        // Update existing profile
        profileResult = await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            login_code: loginCode,
            reality_check_start_time: wakeTime,
            reality_check_end_time: sleepTime,
            trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('phone_number', phone)
          .select()
          .single();
      } else {
        // Create new profile
        profileResult = await supabase
          .from('profiles')
          .insert({
            phone_number: phone,
            first_name: firstName,
            login_code: loginCode,
            reality_check_start_time: wakeTime,
            reality_check_end_time: sleepTime,
            trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          })
          .select()
          .single();
      }

      if (profileResult.error) {
        console.error('Error with profile operation:', profileResult.error);
        throw profileResult.error;
      }

      // Send welcome message with login code
      const welcomeResult = await sendWelcomeMessage(phone, firstName, loginCode);
      if (!welcomeResult.success) {
        console.error('Welcome message failed but continuing with registration:', welcomeResult.error);
      }

      toast({
        title: "Welcome to Morpheus!",
        description: "Check your phone for your login code.",
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Registration error",
        description: "There was a problem with your registration. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit };
}