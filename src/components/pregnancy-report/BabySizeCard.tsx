import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BabySizeCardProps {
  gestationalAge: number;
  weeksLeft: number;
  progressPercentage: number;
  trimester: string;
}

export function BabySizeCard({ gestationalAge, weeksLeft, progressPercentage, trimester }: BabySizeCardProps) {
  const [fruitImage, setFruitImage] = useState<string>("");
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const getFruitSize = (weeks: number) => {
    const fruitSizes: { [key: number]: [string, string] } = {
      4: ["🫐", "blueberry"],
      5: ["🫘", "bean"],
      6: ["🫐", "large blueberry"],
      7: ["🫒", "olive"],
      8: ["🍇", "grape"],
      9: ["🫐", "prune"],
      10: ["🍊", "kumquat"],
      11: ["🥝", "kiwi"],
      12: ["🍊", "lime"],
      13: ["🍋", "lemon"],
      14: ["🍎", "apple"],
      15: ["🥑", "avocado"],
      16: ["🥝", "large avocado"],
      17: ["🥭", "mango"],
      18: ["🍐", "bell pepper"],
      19: ["🥒", "cucumber"],
      20: ["🍌", "banana"],
      21: ["🥖", "carrot"],
      22: ["🥕", "large carrot"],
      23: ["🍆", "eggplant"],
      24: ["🌽", "corn"],
      25: ["🥦", "cauliflower"],
      26: ["🥬", "lettuce"],
      27: ["🥦", "large cauliflower"],
      28: ["🍍", "pineapple"],
      29: ["🎾", "butternut squash"],
      30: ["🥥", "coconut"],
      31: ["🍈", "honeydew melon"],
      32: ["🎃", "squash"],
      33: ["🍈", "cantaloupe"],
      34: ["🍐", "large pineapple"],
      35: ["🎃", "honeydew"],
      36: ["🍈", "papaya"],
      37: ["🎃", "winter melon"],
      38: ["🍉", "small watermelon"],
      39: ["🎃", "pumpkin"],
      40: ["🍉", "watermelon"]
    };
    return fruitSizes[weeks] || ["🫘", "bean"];
  };

  const [fruitEmoji, fruitName] = getFruitSize(gestationalAge);

  useEffect(() => {
    const generateFruitImage = async () => {
      try {
        setIsLoadingImage(true);
        const { data, error } = await supabase.functions.invoke('generate-fruit-image', {
          body: { fruitName }
        });

        if (error) throw error;
        if (data.imageURL) {
          setFruitImage(data.imageURL);
        }
      } catch (error) {
        console.error('Error generating fruit image:', error);
      } finally {
        setIsLoadingImage(false);
      }
    };

    generateFruitImage();
  }, [fruitName]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2 text-peach-500">
          <CalendarDays className="h-5 w-5" />
          <span className="text-sm font-medium">Week {gestationalAge}</span>
        </div>
        <h2 className="text-3xl text-sage-800">{trimester} Trimester</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          {isLoadingImage ? (
            <div className="w-96 h-96 animate-pulse bg-gray-200 rounded-full" />
          ) : fruitImage ? (
            <img src={fruitImage} alt={fruitName} className="w-96 h-96 object-contain" />
          ) : (
            <span className="text-[9rem]">{fruitEmoji}</span>
          )}
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
  );
}