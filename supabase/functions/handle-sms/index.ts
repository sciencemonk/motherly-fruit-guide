import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { getAIResponse } from './openai.ts'
import { medicalKeywords, systemPromptTemplate } from './constants.ts'

console.log('Edge Function loaded and running')

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

serve(async (req) => {
  // Log request details
  console.log('New request received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Content-Type': 'text/plain'
      }
    });
  }

  try {
    // Parse the incoming form data from Twilio
    const formData = await req.formData();
    const messageBody = formData.get('Body')?.toString() || '';
    const from = formData.get('From')?.toString() || '';
    
    console.log('Received SMS:', { body: messageBody, from });

    if (!messageBody) {
      console.error('No message body received');
      return new Response(createTwiMLResponse('Error: No message received'), {
        status: 200,
        headers: { 'Content-Type': 'text/xml' }
      });
    }

    // Get OpenAI API key
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      console.error('OpenAI API key not found');
      return new Response(createTwiMLResponse('Service configuration error'), {
        status: 200,
        headers: { 'Content-Type': 'text/xml' }
      });
    }

    // Check for medical keywords
    const hasMedicalConcern = containsMedicalKeywords(messageBody);
    console.log('Medical concern detected:', hasMedicalConcern);
    
    // Get AI response
    const systemPrompt = systemPromptTemplate(hasMedicalConcern);
    const aiResponse = await getAIResponse(messageBody, systemPrompt, openAiKey);
    
    console.log('AI response generated:', aiResponse);

    // Return TwiML response
    return new Response(createTwiMLResponse(aiResponse), {
      status: 200,
      headers: { 'Content-Type': 'text/xml' }
    });

  } catch (error) {
    console.error('Error processing request:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(
      createTwiMLResponse('An error occurred processing your message. Please try again later.'),
      {
        status: 200,
        headers: { 'Content-Type': 'text/xml' }
      }
    );
  }
});