import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { getAIResponse } from './openai.ts'
import { medicalKeywords, systemPromptTemplate } from './constants.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function createTwiMLResponse(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${message}</Message>
</Response>`;
}

function containsMedicalKeywords(message: string): boolean {
  return medicalKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );
}

function calculateGestationalAge(dueDate: string): number | undefined {
  if (!dueDate) return undefined;
  
  const today = new Date();
  const dueDateObj = new Date(dueDate);
  const diffTime = dueDateObj.getTime() - today.getTime();
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return 40 - diffWeeks;
}

serve(async (req) => {
  console.log('New request received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain'
      }
    });
  }

  try {
    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);

    const formData = new URLSearchParams(rawBody);
    const messageBody = formData.get('Body') || '';
    const from = formData.get('From') || '';
    
    console.log('Parsed SMS details:', { body: messageBody, from });

    if (!messageBody) {
      console.error('No message body received');
      return new Response(createTwiMLResponse('Error: No message received'), {
        status: 200,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'text/xml'
        }
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, due_date')
      .eq('phone_number', from)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
    }

    console.log('User profile:', profile);

    // Calculate gestational age if due date exists
    const gestationalAge = profile?.due_date ? calculateGestationalAge(profile.due_date) : undefined;

    // Check for medical keywords
    const hasMedicalConcern = containsMedicalKeywords(messageBody);
    console.log('Medical concern detected:', hasMedicalConcern);
    
    // Get AI response with user context
    const systemPrompt = systemPromptTemplate(
      hasMedicalConcern,
      profile?.first_name,
      profile?.due_date,
      gestationalAge
    );
    const aiResponse = await getAIResponse(messageBody, systemPrompt, Deno.env.get('OPENAI_API_KEY')!);
    
    console.log('AI response generated:', aiResponse);

    const twimlResponse = createTwiMLResponse(aiResponse);
    console.log('Sending TwiML response:', twimlResponse);

    return new Response(twimlResponse, {
      status: 200,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'text/xml'
      }
    });

  } catch (error) {
    console.error('Error processing request:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(
      createTwiMLResponse('An error occurred processing your message. Please try again later.'),
      {
        status: 200,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'text/xml'
        }
      }
    );
  }
});