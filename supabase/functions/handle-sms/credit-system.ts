import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createTwiMLResponse } from './utils.ts';

export async function deductChatCredit(supabase: any, phoneNumber: string): Promise<{ hasCredits: boolean; verificationCode?: string }> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('chat_credits, subscription_status, subscription_type')
    .eq('phone_number', phoneNumber)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    return { hasCredits: false };
  }

  // If user has unlimited subscription, they always have credits
  if (profile.subscription_status === 'active' && profile.subscription_type === 'unlimited') {
    return { hasCredits: true };
  }

  if (!profile || profile.chat_credits <= 0) {
    console.log('User has no chat credits remaining');
    
    const upgradeMessage = `You've run out of chat credits. Reply with:\n1️⃣ for 50 Chat Credits ($49/month)\n2️⃣ for Unlimited Chats ($79/month)`;
    
    return { 
      hasCredits: false,
      verificationCode: upgradeMessage
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