import { AIResponse } from './types.ts';

export async function getAIResponse(message: string, systemPrompt: string, apiKey: string): Promise<string> {
  console.log('Fetching response from OpenAI...');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('OpenAI API error:', errorData);
    throw new Error('Failed to get AI response');
  }

  const data = await response.json() as AIResponse;
  console.log('Received OpenAI response:', data);
  return data.choices[0].message.content;
}