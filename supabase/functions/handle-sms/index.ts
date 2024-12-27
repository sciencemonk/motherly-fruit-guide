import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { corsHeaders } from './constants.ts'
import { createHmac } from "https://deno.land/std@0.182.0/crypto/mod.ts"
import { getAIResponse } from './openai.ts'
import { medicalKeywords, systemPromptTemplate } from './constants.ts'
import { TwilioMessage } from './types.ts'

console.log('Edge Function loaded and running')

function validateTwilioSignature(requestUrl: string, params: Record<string, string>, twilioSignature: string, authToken: string): boolean {
  // Sort the params
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc: Record<string, string>, key) => {
      acc[key] = params[key];
      return acc;
    }, {});

  // Create the string to sign
  const stringToSign = Object.keys(sortedParams)
    .map(key => key + sortedParams[key])
    .join('');

  // Create HMAC
  const hmac = createHmac("sha1", authToken);
  hmac.update(requestUrl + stringToSign);
  const expectedSignature = hmac.digest("base64");

  console.log('Validation details:', {
    stringToSign,
    expectedSignature,
    receivedSignature: twilioSignature
  });

  return expectedSignature === twilioSignature;
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

serve(async (req) => {
  // Log request details
  console.log('New request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response('ok', { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'text/plain'
      }
    });
  }

  try {
    // Parse the raw body
    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);
    
    // Parse form data
    const formData = new URLSearchParams(rawBody);
    const params = Object.fromEntries(formData.entries());
    console.log('Parsed form data:', params);

    // Extract message content and sender
    const messageBody = params.Body || '';
    const from = params.From || '';
    
    console.log('Message details:', { body: messageBody, from });

    // Get OpenAI API key
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      console.error('OpenAI API key not found');
      return new Response(createTwiMLResponse('Service configuration error'), { 
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/xml'
        }
      });
    }

    // Check for medical keywords
    const hasMedicalConcern = containsMedicalKeywords(messageBody);
    
    // Get AI response
    const systemPrompt = systemPromptTemplate(hasMedicalConcern);
    const aiResponse = await getAIResponse(messageBody, systemPrompt, openAiKey);
    
    console.log('AI response generated:', aiResponse);

    // Return TwiML response
    return new Response(createTwiMLResponse(aiResponse), { 
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/xml'
      }
    });

  } catch (error) {
    console.error('Error processing request:', error);
    console.error('Error stack:', error.stack);
    
    // Return error response in TwiML format
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