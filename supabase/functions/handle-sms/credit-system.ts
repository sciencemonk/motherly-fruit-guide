import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createTwiMLResponse } from './utils.ts';

export async function deductChatCredit(supabase: any, phoneNumber: string): Promise<{ hasCredits: boolean; verificationCode?: string }> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('chat_credits')
    .eq('phone_number', phoneNumber)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    return { hasCredits: false };
  }

  if (!profile || profile.chat_credits <= 0) {
    console.log('User has no chat credits remaining');
    
    // Generate a verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Code expires in 15 minutes

    // Store the verification code
    const { error: codeError } = await supabase
      .from('verification_codes')
      .insert([
        {
          phone_number: phoneNumber,
          code: code,
          expires_at: expiresAt.toISOString(),
        }
      ]);

    if (codeError) {
      console.error('Error storing verification code:', codeError);
      return { hasCredits: false };
    }

    return { 
      hasCredits: false,
      verificationCode: code
    };
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ chat_credits: profile.chat_credits - 1 })
    .eq('phone_number', phoneNumber);

  if (updateError) {
    console.error('Error updating chat credits:', updateError);
    return { hasCredits: false };
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

  return { hasCredits: true };
}