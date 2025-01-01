import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function trackMessage(supabase: any, phoneNumber: string): Promise<{ success: boolean }> {
  try {
    // Log the message transaction
    const { error: transactionError } = await supabase
      .from('message_transactions')
      .insert([
        {
          phone_number: phoneNumber,
          amount: 1,
          transaction_type: 'message_sent'
        }
      ]);

    if (transactionError) {
      console.error('Error logging message transaction:', transactionError);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error('Error tracking message:', error);
    return { success: false };
  }
}