import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const sendWelcomeMessage = async (phoneNumber: string, firstName: string) => {
  try {
    console.log('Sending welcome message to:', phoneNumber);
    
    // Ensure phone number is in E.164 format
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    const e164Phone = formattedPhone.startsWith('+') ? formattedPhone : `+${formattedPhone}`;
    
    const { data, error } = await supabase.functions.invoke('send-welcome-sms', {
      body: {
        to: e164Phone,
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