import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

interface DevelopmentCardProps {
  developmentInfo: string;
}

export function DevelopmentCard({ developmentInfo }: DevelopmentCardProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2 text-peach-500">
          <Brain className="h-5 w-5" />
          <CardTitle>Key Development</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sage-700">{developmentInfo}</p>
      </CardContent>
    </Card>
  );
}