import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationData {
  firstName: string;
  phone: string;
  city: string;
  dueDate: Date;
  interests: string;
  lifestyle: string;
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
          message: `Welcome to Mother Athena, ${firstName}! 🤰 Your 7-day free trial starts now. You'll receive daily pregnancy tips and guidance, and you can text me anytime with questions. For emergencies, always consult your healthcare provider. Reply STOP to cancel messages.`
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Welcome message response:', data);
      return data;
    } catch (error) {
      console.error("Error sending welcome message:", error);
      throw error;
    }
  };

  const generateLoginCode = async (): Promise<string> => {
    const { data, error } = await supabase.rpc('generate_alphanumeric_code', {
      length: 6
    });

    if (error) {
      console.error('Error generating login code:', error);
      throw error;
    }

    return data;
  };

  const handleSubmit = async ({
    firstName,
    phone,
    city,
    dueDate,
    interests,
    lifestyle,
    smsConsent,
    setIsLoading,
    setIsSubmitted
  }: RegistrationData) => {
    if (!firstName || !phone || !city || !dueDate || !interests || !lifestyle) {
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
      const loginCode = await generateLoginCode();
      
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('phone_number')
        .eq('phone_number', phone)
        .single();

      let profileError;
      
      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            city: city,
            due_date: dueDate.toISOString().split('T')[0],
            interests: interests,
            lifestyle: lifestyle,
            login_code: loginCode,
            subscription_type: 'premium',
            subscription_status: 'trial'
          })
          .eq('phone_number', phone);
          
        profileError = updateError;
      } else {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            phone_number: phone,
            first_name: firstName,
            city: city,
            due_date: dueDate.toISOString().split('T')[0],
            interests: interests,
            lifestyle: lifestyle,
            login_code: loginCode,
            subscription_type: 'premium',
            subscription_status: 'trial'
          }]);
          
        profileError = insertError;
      }

      if (profileError) {
        console.error('Error with profile:', profileError);
        throw profileError;
      }

      await sendWelcomeMessage(phone, firstName);

      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-checkout',
        {
          body: { 
            phone_number: phone,
            trial: true
          }
        }
      );

      if (checkoutError) {
        console.error('Error creating checkout session:', checkoutError);
        throw checkoutError;
      }

      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      }

      toast({
        title: "Welcome to Mother Athena!",
        description: "We're excited to be part of your pregnancy journey.",
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