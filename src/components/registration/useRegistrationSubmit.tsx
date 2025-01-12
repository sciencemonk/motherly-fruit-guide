import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationData {
  firstName: string;
  phone: string;
  dueDate: Date;
  lastPeriod?: Date;
  city: string;
  state: string;
  interests: string;
  lifestyle: string;
  preferredTime: string;
  smsConsent: boolean;
  pregnancyStatus: string;
  wakeTime: string;
  sleepTime: string;
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
    dueDate,
    lastPeriod,
    city,
    state,
    interests,
    lifestyle,
    preferredTime,
    smsConsent,
    pregnancyStatus,
    wakeTime,
    sleepTime,
    setIsLoading,
    setIsSubmitted
  }: RegistrationData) => {
    if (!firstName || !phone || !pregnancyStatus) {
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
      // Check if profile exists using maybeSingle() instead of single()
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone_number', phone)
        .maybeSingle();

      if (profileError) {
        console.error('Error checking profile:', profileError);
        throw profileError;
      }

      // Generate a login code using the database function
      const { data: loginCodeData, error: loginCodeError } = await supabase
        .rpc('generate_alphanumeric_code', { length: 6 });

      if (loginCodeError) {
        console.error('Error generating login code:', loginCodeError);
        throw loginCodeError;
      }

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            due_date: pregnancyStatus === 'expecting' ? dueDate.toISOString().split('T')[0] : null,
            last_period: pregnancyStatus === 'trying' ? lastPeriod?.toISOString().split('T')[0] : null,
            login_code: loginCodeData,
            city,
            state,
            interests,
            lifestyle,
            preferred_notification_time: preferredTime,
            pregnancy_status: pregnancyStatus,
            reality_check_start_time: wakeTime,
            reality_check_end_time: sleepTime,
            trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('phone_number', phone);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          throw updateError;
        }
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            phone_number: phone,
            first_name: firstName,
            due_date: pregnancyStatus === 'expecting' ? dueDate.toISOString().split('T')[0] : null,
            last_period: pregnancyStatus === 'trying' ? lastPeriod?.toISOString().split('T')[0] : null,
            login_code: loginCodeData,
            city,
            state,
            interests,
            lifestyle,
            preferred_notification_time: preferredTime,
            pregnancy_status: pregnancyStatus,
            reality_check_start_time: wakeTime,
            reality_check_end_time: sleepTime,
            trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          });

        if (insertError) {
          console.error('Error storing profile:', insertError);
          throw insertError;
        }
      }

      // Send welcome message with login code
      const welcomeResult = await sendWelcomeMessage(phone, firstName, loginCodeData);
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