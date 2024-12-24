import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface WeeklyTipsCardProps {
  weeklyTips: string[];
}

export function WeeklyTipsCard({ weeklyTips }: WeeklyTipsCardProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2 text-peach-500">
          <Heart className="h-5 w-5" />
          <CardTitle>Tips for This Week</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sage-700">
          {weeklyTips.map((tip, index) => (
            <li key={index}>• {tip}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}