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
  
  // Map weeks to fruit sizes
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

  // Get development info based on weeks
  const getDevelopmentInfo = (weeks: number) => {
    const developments: { [key: number]: string } = {
      4: "Your baby's neural tube is developing into their brain and spinal cord.",
      5: "Tiny buds that will become arms and legs are forming.",
      6: "Your baby's heart begins to beat.",
      7: "Your baby's face is forming, with tiny nostrils visible.",
      8: "Baby's neural pathways in the brain are developing.",
      9: "External genitalia begin to form.",
      10: "Your baby can now make small movements.",
      11: "Baby's bones are starting to harden.",
      12: "Reflexes are developing; baby can now move fingers and toes.",
      13: "Vocal cords are forming.",
      14: "Baby's facial muscles are developing; they can squint and frown.",
      15: "Baby is forming taste buds.",
      16: "Baby can make sucking movements.",
      17: "Baby's skeleton is hardening from cartilage to bone.",
      18: "Baby's ears are in their final position.",
      19: "Vernix (protective coating) covers baby's skin.",
      20: "Baby can hear your voice and other sounds.",
      21: "Baby's eyebrows and eyelids are fully formed.",
      22: "Baby's lips and mouth are more distinct.",
      23: "Baby begins to have regular sleep and wake cycles.",
      24: "Baby's inner ear is fully developed.",
      25: "Baby responds to your voice and touch.",
      26: "Baby's eyes begin to open.",
      27: "Brain tissue and neurons are rapidly developing.",
      28: "Baby can blink and has eyelashes.",
      29: "Baby's muscles and lungs are maturing.",
      30: "Baby's fingernails have grown to fingertips.",
      31: "Baby's brain can control body temperature.",
      32: "Baby's bones fully developed, but skull remains soft.",
      33: "Baby's immune system is developing.",
      34: "Baby's central nervous system is maturing.",
      35: "Most internal systems are well developed.",
      36: "Baby's skin is getting smoother.",
      37: "Baby is practicing breathing movements.",
      38: "Baby's organs are ready for life outside the womb.",
      39: "Baby's brain and lungs continue to mature.",
      40: "Your baby is fully developed and ready to meet you!"
    };
    return developments[weeks] || "Your baby is developing new features every day!";
  };

  // Get weekly tips based on trimester
  const getTrimesterTips = (trimester: string) => {
    const tips = {
      "First": [
        "Take prenatal vitamins daily",
        "Stay hydrated",
        "Get plenty of rest",
        "Avoid raw or undercooked foods"
      ],
      "Second": [
        "Do Kegel exercises",
        "Stay active with gentle exercise",
        "Monitor your blood pressure",
        "Start planning your nursery"
      ],
      "Third": [
        "Practice breathing exercises",
        "Prepare your hospital bag",
        "Monitor baby's movements",
        "Get plenty of sleep while you can"
      ]
    };
    return tips[trimester as keyof typeof tips] || [];
  };

  const [fruitEmoji, fruitName] = getFruitSize(gestationalAge);
  const developmentInfo = getDevelopmentInfo(gestationalAge);
  const weeklyTips = getTrimesterTips(trimester);

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
            {developmentInfo}
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
            {weeklyTips.map((tip, index) => (
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