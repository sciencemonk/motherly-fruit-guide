import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationData {
  firstName: string;
  phone: string;
  dueDate: Date;
  interests: string;
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
    dueDate,
    interests,
    smsConsent,
    setIsLoading,
    setIsSubmitted
  }: RegistrationData) => {
    if (!firstName || !phone || !dueDate || !interests) {
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

      // Generate a unique login code
      const loginCode = await generateLoginCode();

      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            phone_number: phone,
            first_name: firstName,
            due_date: dueDate.toISOString().split('T')[0],
            interests: interests,
            login_code: loginCode,
            subscription_type: 'premium',
            subscription_status: 'trial'
          }
        ]);

      if (insertError) {
        console.error('Error storing profile:', insertError);
        throw insertError;
      }

      await sendWelcomeMessage(phone, firstName);

      // Create Stripe checkout session for trial
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

      // Redirect to Stripe checkout
      window.location.href = checkoutData.url;

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