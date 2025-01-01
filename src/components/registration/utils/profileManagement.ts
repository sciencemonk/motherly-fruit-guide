import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  firstName: string;
  phone: string;
  city: string;
  dueDate: Date;
  interests: string;
  lifestyle: string;
  preferredTime: string;
}

export const handleProfileUpdate = async ({
  firstName,
  phone,
  city,
  dueDate,
  interests,
  lifestyle,
  preferredTime
}: ProfileData) => {
  // Check if profile exists
  const { data: existingProfile, error: queryError } = await supabase
    .from('profiles')
    .select('phone_number')
    .eq('phone_number', phone)
    .maybeSingle();

  if (queryError) {
    console.error('Error checking existing profile:', queryError);
    throw queryError;
  }

  const profileData = {
    first_name: firstName,
    city: city,
    due_date: dueDate.toISOString().split('T')[0],
    interests: interests,
    lifestyle: lifestyle,
    preferred_notification_time: preferredTime,
    login_code: await generateLoginCode(),
    subscription_type: 'premium',
    subscription_status: 'trial'
  };

  let profileError;
  
  if (existingProfile) {
    const { error: updateError } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('phone_number', phone);
      
    profileError = updateError;
  } else {
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        phone_number: phone,
        ...profileData
      });
      
    profileError = insertError;
  }

  if (profileError) {
    console.error('Error with profile:', profileError);
    throw profileError;
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