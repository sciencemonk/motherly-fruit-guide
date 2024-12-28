import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { getAIResponse } from './openai.ts'
import { medicalKeywords, systemPromptTemplate, corsHeaders } from './constants.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getConversationHistory, saveMessage } from './chat-history.ts'
import { deductChatCredit } from './credit-system.ts'
import { createTwiMLResponse, calculateGestationalAge } from './utils.ts'

serve(async (req) => {
  console.log('New request received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain'
      }
    });
  }

  try {
    const rawBody = await req.text();
    const formData = new URLSearchParams(rawBody);
    const messageBody = formData.get('Body') || '';
    const from = formData.get('From') || '';
    
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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { hasCredits } = await deductChatCredit(supabase, from);
    if (!hasCredits) {
      // Check if the message is a subscription choice
      if (messageBody.trim() === '1' || messageBody.trim() === '2') {
        // Create a Stripe checkout session with the chosen option
        const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({ 
            phone_number: from,
            price_option: messageBody.trim()
          })
        });

        const { url: checkoutUrl, error } = await response.json();
        
        if (error) {
          console.error('Error creating checkout session:', error);
          return new Response(createTwiMLResponse("I'm sorry, there was an error creating your checkout session. Please try again later."), {
            status: 200,
            headers: { 
              ...corsHeaders,
              'Content-Type': 'text/xml'
            }
          });
        }

        return new Response(createTwiMLResponse(`Great choice! Click here to complete your subscription: ${checkoutUrl}`), {
          status: 200,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'text/xml'
          }
        });
      }

      // If not a subscription choice, present the options
      const upgradeMessage = `You've run out of chat credits. Reply with:\n1️⃣ for Monthly Premium ($29/month)\n2️⃣ for Annual Premium ($290/year, save 17%)`;
      
      return new Response(createTwiMLResponse(upgradeMessage), {
        status: 200,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'text/xml'
        }
      });
    }

    // Fetch user profile and conversation history
    const [{ data: profile }, previousMessages] = await Promise.all([
      supabase
        .from('profiles')
        .select('first_name, due_date')
        .eq('phone_number', from)
        .single(),
      getConversationHistory(supabase, from)
    ]);

    // Save user message
    await saveMessage(supabase, from, 'user', messageBody);

    // Calculate gestational age if due date exists
    const gestationalAge = profile?.due_date ? calculateGestationalAge(profile.due_date) : undefined;

    // Check for medical keywords
    const hasMedicalConcern = medicalKeywords.some(keyword => 
      messageBody.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Get AI response with user context and conversation history
    const systemPrompt = systemPromptTemplate(
      hasMedicalConcern,
      profile?.first_name,
      profile?.due_date,
      gestationalAge
    );

    const aiResponse = await getAIResponse(messageBody, systemPrompt, Deno.env.get('OPENAI_API_KEY')!);
    
    // Save assistant response
    await saveMessage(supabase, from, 'assistant', aiResponse);
    
    console.log('AI response generated:', aiResponse);

    return new Response(createTwiMLResponse(aiResponse), {
      status: 200,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'text/xml'
      }
    });
  } catch (error) {
    console.error('Error processing request:', error);
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