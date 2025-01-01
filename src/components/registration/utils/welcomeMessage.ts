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
        message: `Hi ${firstName}! I'm Mother Athena and I'm here to help you grow a healthy baby. I'll send you a message each day along this magical journey. If you ever have a question, like can I eat this?!, just send me a message!\n\nA big part of having a successful pregnancy is to relax... so right now take a deep breath in and slowly exhale. You've got this! ❤️`
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