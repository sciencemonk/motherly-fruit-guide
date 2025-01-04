import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationData {
  firstName: string;
  phone: string;
  dueDate: Date;
  smsConsent: boolean;
  setIsLoading: (loading: boolean) => void;
  setIsSubmitted: (submitted: boolean) => void;
}

export function useRegistrationSubmit() {
  const { toast } = useToast();

  const sendWelcomeMessage = async (phoneNumber: string, firstName: string) => {
    try {
      console.log('Sending welcome message to:', phoneNumber);
      
      const { data, error } = await supabase.functions.invoke('send-welcome-sms', {
        body: {
          to: phoneNumber,
          message: `Hello ${firstName}! I'm Mother Athena. Each week I'll text you an update about your current stage of pregnancy. You can also text me 24/7 with any pregnancy related questions. If you have an emergency or you might be in danger consult your healthcare professional!`
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        // Don't throw the error, just log it
        return { success: false, error };
      }

      console.log('Welcome message response:', data);
      return { success: true, data };
    } catch (error) {
      console.error("Error sending welcome message:", error);
      // Don't throw the error, just return failure
      return { success: false, error };
    }
  };

  const handleSubmit = async ({
    firstName,
    phone,
    dueDate,
    smsConsent,
    setIsLoading,
    setIsSubmitted
  }: RegistrationData) => {
    if (!firstName || !phone || !dueDate) {
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

      // Create new profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            phone_number: phone,
            first_name: firstName,
            due_date: dueDate.toISOString().split('T')[0],
          }
        ]);

      if (insertError) {
        console.error('Error storing profile:', insertError);
        throw insertError;
      }

      // Attempt to send welcome message but don't block on failure
      const welcomeResult = await sendWelcomeMessage(phone, firstName);
      if (!welcomeResult.success) {
        console.error('Welcome message failed but continuing with registration:', welcomeResult.error);
        // Log the error but don't throw - we still want to complete registration
      }

      toast({
        title: "Welcome to Mother Athena!",
        description: "We're excited to be part of your pregnancy journey.",
      });
      
      // Set submitted to true even if welcome message failed
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