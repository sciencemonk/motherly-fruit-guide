import { Profile } from './types.ts';

export async function generatePregnancyMessage(profile: Profile, apiKey: string): Promise<string> {
  const dueDate = new Date(profile.due_date);
  const today = new Date();
  const gestationalAge = 40 - Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7));

  const prompt = `You are Mother Athena, a knowledgeable and caring AI assistant for pregnant women. 
  Create a personalized daily message for ${profile.first_name} who is ${gestationalAge} weeks pregnant.
  Their interests include ${profile.interests} and their lifestyle is described as ${profile.lifestyle}.
  
  Focus on evidence-based medical information and research about:
  1. Fetal development at this stage
  2. Recommended lifestyle adjustments based on their interests: ${profile.interests}
  3. Environmental considerations relevant to their lifestyle: ${profile.lifestyle}
  4. Mental well-being and mindset tips personalized to their situation
  
  Keep the message warm, supportive, and under 320 characters to fit in an SMS.
  Include one specific, actionable tip based on their interests and lifestyle.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are Mother Athena, a knowledgeable and caring AI assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

export async function generateFertilityMessage(profile: Profile, apiKey: string): Promise<string> {
  let fertilityInfo = "";
  
  if (profile.last_period) {
    const lastPeriod = new Date(profile.last_period);
    const today = new Date();
    const daysSinceLastPeriod = Math.ceil((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    const cycleDay = (daysSinceLastPeriod % 28) + 1;
    
    const isFertileWindow = cycleDay >= 11 && cycleDay <= 17;
    const isOvulation = cycleDay === 14;
    
    fertilityInfo = `Based on your last period, you're on day ${cycleDay} of your cycle. ${
      isFertileWindow ? "You're in your fertile window! This is an optimal time for conception." :
      isOvulation ? "You're likely ovulating today! This is the peak time for conception." :
      "Continue tracking your cycle and maintaining healthy habits."
    }`;
  }

  const prompt = `You are Mother Athena, a knowledgeable and caring AI assistant for women trying to conceive.
  Create a personalized daily message for ${profile.first_name} who is trying to get pregnant.
  Their interests include ${profile.interests} and their lifestyle is described as ${profile.lifestyle}.
  
  Current fertility information: ${fertilityInfo}
  
  Focus on evidence-based medical information and research about:
  1. Fertility optimization specific to their interests: ${profile.interests}
  2. Lifestyle factors that impact fertility, considering their current lifestyle: ${profile.lifestyle}
  3. Environmental considerations relevant to their situation
  4. Mental well-being and stress management personalized to their needs
  
  Keep the message warm, supportive, and under 320 characters to fit in an SMS.
  Include one specific, actionable tip based on their interests and lifestyle.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are Mother Athena, a knowledgeable and caring AI assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}