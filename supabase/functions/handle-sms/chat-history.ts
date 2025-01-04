import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function getConversationHistory(supabase: any, phoneNumber: string, limit: number = 3) {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('phone_number', phoneNumber)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }

  return data || [];
}

export async function saveMessage(supabase: any, phoneNumber: string, role: 'user' | 'assistant', content: string) {
  const { error } = await supabase
    .from('chat_history')
    .insert([
      {
        phone_number: phoneNumber,
        role,
        content
      }
    ]);

  if (error) {
    console.error('Error saving message to chat history:', error);
  }
}