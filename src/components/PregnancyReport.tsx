import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Brain, Heart } from "lucide-react";

interface PregnancyReportProps {
  dueDate: Date;
}

export function PregnancyReport({ dueDate }: PregnancyReportProps) {
  // Calculate weeks based on due date
  const today = new Date();
  const gestationalAge = 40 - Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7));
  const weeksLeft = 40 - gestationalAge;
  const progressPercentage = (gestationalAge / 40) * 100;

  // Determine trimester
  const trimester = gestationalAge <= 13 ? "First" : gestationalAge <= 26 ? "Second" : "Third";
  
  // Simple fruit size comparison based on weeks
  const fruitSize = "🍌";

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
            <span className="text-6xl">{fruitSize}</span>
            <div className="text-center">
              <p className="text-sage-700">Your baby is about the size of a</p>
              <p className="text-lg font-semibold text-sage-800">banana</p>
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
            Your baby's hearing is developing. They can now hear your voice and other sounds from the outside world.
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
            <li>• Monitor your blood pressure</li>
            <li>• Do Kegel exercises</li>
            <li>• Stay active but don't overexert</li>
          </ul>
        </CardContent>
      </Card>

      <div className="text-center text-sage-600 p-4 bg-sage-50 rounded-lg">
        <p>📱 Check your phone for a welcome message from Mother Athens!</p>
      </div>
    </div>
  );
}