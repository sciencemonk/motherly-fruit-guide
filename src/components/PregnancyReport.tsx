import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Brain, Heart } from "lucide-react";
import OpenAI from "openai";
import { supabase } from "@/integrations/supabase/client";

interface PregnancyReportProps {
  dueDate: Date;
}

interface PregnancyInfo {
  fruitSize: string;
  development: string;
  tips: string[];
}

interface Secret {
  id: string;
  name: string;
  value: string;
  created_at: string;
}

export function PregnancyReport({ dueDate }: PregnancyReportProps) {
  const [pregnancyInfo, setPregnancyInfo] = useState<PregnancyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate weeks based on due date
  const today = new Date();
  const gestationalAge = 40 - Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7));
  const weeksLeft = 40 - gestationalAge;
  const progressPercentage = (gestationalAge / 40) * 100;

  // Determine trimester
  const trimester = gestationalAge <= 13 ? "First" : gestationalAge <= 26 ? "Second" : "Third";

  useEffect(() => {
    const fetchPregnancyInfo = async () => {
      try {
        // Get OpenAI API key from Supabase
        const { data: secretData, error: secretError } = await supabase
          .from('secrets')
          .select('*')
          .eq('name', 'OPENAI_API_KEY')
          .single();

        if (secretError || !secretData) {
          throw new Error('Failed to retrieve OpenAI API key');
        }

        const openai = new OpenAI({
          apiKey: (secretData as Secret).value,
          dangerouslyAllowBrowser: true
        });

        const prompt = `You are a pregnancy expert assistant. Generate information about fetal development at week ${gestationalAge} of pregnancy. 
        Return the response in this exact JSON format:
        {
          "fruitSize": "name of a fruit that matches the size of the baby this week",
          "development": "one sentence about key development this week",
          "tips": ["3 health tips for this week"]
        }
        Keep the fruit size simple and commonly known. Keep development and tips concise and evidence-based.`;

        const completion = await openai.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "gpt-4",
          response_format: { type: "json_object" }
        });

        const response = JSON.parse(completion.choices[0].message.content);
        setPregnancyInfo(response);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load pregnancy information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPregnancyInfo();
  }, [gestationalAge]);

  // Map fruit names to emoji
  const fruitEmoji: { [key: string]: string } = {
    poppy: "🌺",
    sesame: "🌱",
    blueberry: "🫐",
    raspberry: "🫐",
    strawberry: "🍓",
    lime: "🍋",
    lemon: "🍋",
    orange: "🍊",
    apple: "🍎",
    avocado: "🥑",
    mango: "🥭",
    banana: "🍌",
    papaya: "🍈",
    coconut: "🥥",
    pineapple: "🍍",
    cantaloupe: "🍈",
    lettuce: "🥬",
    cauliflower: "🥦",
    cabbage: "🥬",
    squash: "🎃",
    pumpkin: "🎃",
    watermelon: "🍉",
  };

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <p className="text-sage-600">Loading your pregnancy report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  const getFruitEmoji = (fruitName: string) => {
    const lowercaseFruit = fruitName.toLowerCase();
    return fruitEmoji[lowercaseFruit] || "🍎"; // Default to apple if fruit not found
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2 text-peach-500">
            <CalendarDays className="h-5 w-5" />
            <span className="text-sm font-medium">Week {gestationalAge}</span>
          </div>
          <CardTitle className="text-3xl text-sage-800">{trimester} Trimester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <span className="text-6xl">{pregnancyInfo ? getFruitEmoji(pregnancyInfo.fruitSize) : "🍎"}</span>
            <div className="text-center">
              <p className="text-sage-700">Your baby is about the size of a</p>
              <p className="text-lg font-semibold text-sage-800">{pregnancyInfo?.fruitSize || "apple"}</p>
              <p className="text-sage-600 text-sm">{weeksLeft} weeks until your due date</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-center text-sage-600 text-sm">
              {Math.round(progressPercentage)}% of your pregnancy journey completed
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2 text-peach-500">
            <Brain className="h-5 w-5" />
            <CardTitle>Key Development</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sage-700">
            {pregnancyInfo?.development || "Loading development information..."}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2 text-peach-500">
            <Heart className="h-5 w-5" />
            <CardTitle>Tips for This Week</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sage-700">
            {pregnancyInfo?.tips.map((tip, index) => (
              <li key={index}>• {tip}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="text-center text-sage-600 p-4 bg-sage-50 rounded-lg">
        <p>📱 Check your phone for a welcome message from Mother Athena!</p>
      </div>
    </div>
  );
}