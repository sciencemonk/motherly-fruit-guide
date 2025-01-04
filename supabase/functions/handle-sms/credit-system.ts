import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function deductChatCredit(supabase: any, phoneNumber: string): Promise<boolean> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('chat_credits')
    .eq('phone_number', phoneNumber)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    return false;
  }

  if (!profile || profile.chat_credits <= 0) {
    console.log('User has no chat credits remaining');
    return false;
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ chat_credits: profile.chat_credits - 1 })
    .eq('phone_number', phoneNumber);

  if (updateError) {
    console.error('Error updating chat credits:', updateError);
    return false;
  }

  // Log the credit transaction
  const { error: transactionError } = await supabase
    .from('credit_transactions')
    .insert([
      {
        phone_number: phoneNumber,
        amount: -1,
        transaction_type: 'message_sent'
      }
    ]);

  if (transactionError) {
    console.error('Error logging credit transaction:', transactionError);
  }

  return true;
}