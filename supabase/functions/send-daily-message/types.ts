export interface Profile {
  phone_number: string;
  first_name: string;
  due_date: string;
  interests: string;
  lifestyle: string;
  preferred_notification_time: string;
  pregnancy_status: string;
  last_period?: string;
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};