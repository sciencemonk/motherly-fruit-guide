import { supabase } from "@/integrations/supabase/client";

export const sendWelcomeMessage = async (phoneNumber: string, firstName: string) => {
  try {
    console.log('Attempting to send welcome message to:', phoneNumber);
    
    // Ensure phone number is in E.164 format
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    const e164Phone = formattedPhone.startsWith('+') ? formattedPhone : `+${formattedPhone}`;
    
    console.log('Environment:', {
      isProd: window.location.hostname === 'motherathena.com',
      hostname: window.location.hostname
    });

    // Use the handle-sms function instead
    const functionName = 'handle-sms';
    
    console.log('Invoking handle-sms function with params:', {
      From: process.env.TWILIO_PHONE_NUMBER,
      To: e164Phone,
      Body: `Hi ${firstName}! I'm Mother Athena and I'm here to help you grow a healthy baby. I'll send you a message each day along this magical journey. If you ever have a question, like can I eat this?!, just send me a message!\n\nA big part of having a successful pregnancy is to relax... so right now take a deep breath in and slowly exhale. You've got this! ❤️`
    });

    const { data, error } = await supabase.functions.invoke(functionName, {
      body: {
        From: process.env.TWILIO_PHONE_NUMBER,
        To: e164Phone,
        Body: `Hi ${firstName}! I'm Mother Athena and I'm here to help you grow a healthy baby. I'll send you a message each day along this magical journey. If you ever have a question, like can I eat this?!, just send me a message!\n\nA big part of having a successful pregnancy is to relax... so right now take a deep breath in and slowly exhale. You've got this! ❤️`
      }
    });

    if (error) {
      console.error('Error from edge function:', error);
      console.error('Full error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('Welcome message response:', data);
    return data;
  } catch (error) {
    console.error("Error sending welcome message:", error);
    throw error;
  }
};