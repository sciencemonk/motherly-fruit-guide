import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function deductChatCredit(supabase: any, phoneNumber: string): Promise<boolean> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('trial_ends_at')
    .eq('phone_number', phoneNumber)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    return false;
  }

  // If trial_ends_at is in the future, allow the message
  if (profile.trial_ends_at) {
    const trialEndsAt = new Date(profile.trial_ends_at);
    const now = new Date();
    
    if (trialEndsAt > now) {
      console.log('User is within trial period, allowing message');
      return true;
    }
  }

  // Trial has ended, inform user they need to upgrade
  console.log('Trial has ended, user needs to upgrade');
  return false;
}