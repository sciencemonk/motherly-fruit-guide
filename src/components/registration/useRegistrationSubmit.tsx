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
  setIsLoading: (loading: boolean) => void;
  setIsSubmitted: (submitted: boolean) => void;
}

export function useRegistrationSubmit() {
  const { toast } = useToast();

  const sendWelcomeMessage = async (phoneNumber: string, firstName: string, pregnancyStatus: string) => {
    try {
      console.log('Sending welcome message to:', phoneNumber);
      
      const welcomeMessage = pregnancyStatus === 'expecting' 
        ? `Hello ${firstName}! I'm Mother Athena. Each day I'll text you with helpful information to help you grow a healthy baby. You can text me 24/7 with any pregnancy related questions you might have. Remember to always verify any information with a healthcare professional and seek help from a medical professional if you're ever in distress. Ps. You're amazing!`
        : `Hello ${firstName}! I'm Mother Athena. Each day I'll text you with helpful fertility information. You can text me 24/7 with any fertility related questions you might have. Remember to always verify any information with a healthcare professional and seek help from a medical professional if you're ever in distress. Ps. You're amazing!`;

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
      // Check for existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('phone_number', phone)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking existing profile:', fetchError);
        throw fetchError;
      }

      if (existingProfile) {
        toast({
          variant: "destructive",
          title: "Phone number already registered",
          description: "This phone number is already registered. Please use a different phone number or log in to your existing account.",
        });
        setIsLoading(false);
        return;
      }

      // Generate a login code using the database function
      const { data: loginCodeData, error: loginCodeError } = await supabase
        .rpc('generate_alphanumeric_code', { length: 6 });

      if (loginCodeError) {
        console.error('Error generating login code:', loginCodeError);
        throw loginCodeError;
      }

      // Create new profile with the generated login code and additional fields
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
          pregnancy_status: pregnancyStatus
        });

      if (insertError) {
        console.error('Error storing profile:', insertError);
        throw insertError;
      }

      // Attempt to send welcome message but don't block on failure
      const welcomeResult = await sendWelcomeMessage(phone, firstName, pregnancyStatus);
      if (!welcomeResult.success) {
        console.error('Welcome message failed but continuing with registration:', welcomeResult.error);
      }

      toast({
        title: "Welcome to Mother Athena!",
        description: "We're excited to be part of your journey.",
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