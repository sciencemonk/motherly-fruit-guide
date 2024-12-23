import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { gestationalAge } = await req.json();
    
    const prompt = `You are a knowledgeable and caring pregnancy expert. Generate a brief report about fetal development at week ${gestationalAge} of pregnancy. Include:
    1. Key developmental milestones happening this week (2-3 sentences)
    2. Three specific tips for the mother's health and comfort this week
    
    Keep the response concise and supportive. Use evidence-based information.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a knowledgeable and caring pregnancy expert.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const report = data.choices[0].message.content;
    
    // Split the report into development and tips sections
    const [development, tipsSection] = report.split(/Tips|Recommendations/i);
    const tips = tipsSection
      ? tipsSection
          .split(/\d+\.|\n-|\n•/)
          .filter(tip => tip.trim())
          .map(tip => tip.trim())
      : [];

    return new Response(
      JSON.stringify({
        development: development.trim(),
        tips,
        fruitSize: fruitSizes[gestationalAge] || "watermelon 🍉"
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});