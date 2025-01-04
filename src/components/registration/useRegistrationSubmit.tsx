import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    if (!firstName || !phone || !city || !state || !dueDate || !interests || !lifestyle || !preferredTime) {
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
      // Generate login code
      const { data: loginCode, error: loginCodeError } = await supabase
        .rpc('generate_alphanumeric_code', {
          length: 6
        });

      if (loginCodeError) throw loginCodeError;

      // Create new profile with trial status
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
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
          login_code: loginCode
        });

      if (insertError) throw insertError;

      // Send welcome message using handle-sms function
      const response = await supabase.functions.invoke('handle-sms', {
        body: {
          From: process.env.TWILIO_PHONE_NUMBER,
          To: phone,
          Body: `Hi ${firstName}! I'm Mother Athena and I'm here to help you grow a healthy baby. I'll send you a message each day along this magical journey. If you ever have a question, like can I eat this?!, just send me a message!\n\nA big part of having a successful pregnancy is to relax... so right now take a deep breath in and slowly exhale. You've got this! ❤️`
        }
      });

      if (response.error) throw response.error;

      // Set registration as completed
      setIsSubmitted(true);
      
      // Redirect to welcome page with phone number
      window.location.href = `/welcome?phone=${encodeURIComponent(phone)}&firstName=${encodeURIComponent(firstName)}&registration=success`;

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