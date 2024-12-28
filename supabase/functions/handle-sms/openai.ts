export async function getAIResponse(message: string, systemPrompt: string, apiKey: string): Promise<string> {
  console.log('Fetching response from OpenAI with message:', message);
  console.log('System prompt:', systemPrompt);
  
  try {
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
        max_tokens: 1000, // Increased from 300 to allow for longer responses
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error response:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI raw response:', data);

    if (!data.choices?.[0]?.message?.content) {
      console.error('Unexpected OpenAI response format:', data);
      throw new Error('Invalid response format from OpenAI');
    }

    const aiResponse = data.choices[0].message.content.trim();
    console.log('Processed AI response:', aiResponse);
    return aiResponse;
  } catch (error) {
    console.error('Error in getAIResponse:', error);
    throw new Error(`Failed to get AI response: ${error.message}`);
  }
}