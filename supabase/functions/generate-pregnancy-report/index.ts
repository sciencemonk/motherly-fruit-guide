import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const fruitSizes = {
  4: "poppy seed 🌱",
  5: "sesame seed 🌱",
  6: "lentil 🫘",
  7: "blueberry 🫐",
  8: "raspberry 🫐",
  9: "olive 🫒",
  10: "prune 🫐",
  11: "lime 🍈",
  12: "plum 🍑",
  13: "peach 🍑",
  14: "lemon 🍋",
  15: "apple 🍎",
  16: "avocado 🥑",
  17: "pear 🍐",
  18: "bell pepper 🫑",
  19: "mango 🥭",
  20: "banana 🍌",
  21: "pomegranate 🍎",
  22: "papaya 🍈",
  23: "grapefruit 🍊",
  24: "corn 🌽",
  25: "cauliflower 🥦",
  26: "lettuce 🥬",
  27: "cabbage 🥬",
  28: "eggplant 🍆",
  29: "butternut squash 🎃",
  30: "cucumber 🥒",
  31: "coconut 🥥",
  32: "pineapple 🍍",
  33: "honeydew melon 🍈",
  34: "cantaloupe 🍈",
  35: "honeydew melon 🍈",
  36: "papaya 🍈",
  37: "winter melon 🍈",
  38: "pumpkin 🎃",
  39: "watermelon 🍉",
  40: "watermelon 🍉"
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { gestationalAge } = await req.json();
    
    const prompt = `You are a knowledgeable and caring pregnancy expert. Generate a brief report about fetal development at week ${gestationalAge} of pregnancy. Include:
    1. Key developmental milestones happening this week (2-3 sentences)
    2. Three specific tips for the mother's health and comfort this week
    
    Keep the response concise and supportive. Use evidence-based information.`;

    console.log('Sending request to OpenAI with prompt:', prompt);

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-mini',
        messages: [
          { role: 'system', content: 'You are a knowledgeable and caring pregnancy expert.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await openAIResponse.json();
    console.log('OpenAI API response:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected OpenAI API response structure:', data);
      throw new Error('Invalid response from OpenAI API');
    }

    const report = data.choices[0].message.content;
    
    // Split the report into development and tips sections
    const [development, tipsSection] = report.split(/Tips|Recommendations/i);
    const tips = tipsSection
      ? tipsSection
          .split(/\d+\.|\n-|\n•/)
          .filter(tip => tip.trim())
          .map(tip => tip.trim())
      : [];

    const response = {
      development: development.trim(),
      tips,
      fruitSize: fruitSizes[gestationalAge] || "watermelon 🍉"
    };

    console.log('Sending response:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-pregnancy-report function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});