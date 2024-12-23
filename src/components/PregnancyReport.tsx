import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Brain, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PregnancyReportProps {
  dueDate: Date;
}

interface PregnancyInfo {
  development: string;
  tips: string[];
  fruitSize: string;
}

export function PregnancyReport({ dueDate }: PregnancyReportProps) {
  const [pregnancyInfo, setPregnancyInfo] = useState<PregnancyInfo | null>(null);
  const { toast } = useToast();
  
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
        const { data, error } = await supabase.functions.invoke('generate-pregnancy-report', {
          body: { gestationalAge }
        });

        if (error) {
          throw error;
        }

        setPregnancyInfo(data);
      } catch (error) {
        console.error("Error fetching pregnancy information:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load pregnancy information. Please try again later.",
        });
      }
    };

    fetchPregnancyInfo();
  }, [gestationalAge, toast]);

  if (!pregnancyInfo) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [fruitName, fruitEmoji] = pregnancyInfo.fruitSize.split(/(\s*[^\w\s]\s*)/).filter(Boolean);

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
            <span className="text-6xl">{fruitEmoji}</span>
            <div className="text-center">
              <p className="text-sage-700">Your baby is about the size of a</p>
              <p className="text-lg font-semibold text-sage-800">{fruitName}</p>
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
            {pregnancyInfo.development}
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
            {pregnancyInfo.tips.map((tip, index) => (
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