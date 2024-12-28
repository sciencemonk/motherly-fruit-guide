import { useState } from "react";
import { BabySizeCard } from "./pregnancy-report/BabySizeCard";
import { DevelopmentCard } from "./pregnancy-report/DevelopmentCard";
import { WeeklyTipsCard } from "./pregnancy-report/WeeklyTipsCard";

interface PregnancyReportProps {
  dueDate: Date;
  firstName?: string;
}

export function PregnancyReport({ dueDate, firstName = "" }: PregnancyReportProps) {
  // Calculate weeks based on due date
  const today = new Date();
  const gestationalAge = 40 - Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7));
  const weeksLeft = 40 - gestationalAge;
  const progressPercentage = (gestationalAge / 40) * 100;

  // Determine trimester
  const trimester = gestationalAge <= 13 ? "First" : gestationalAge <= 26 ? "Second" : "Third";

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

  const developmentInfo = getDevelopmentInfo(gestationalAge);
  const weeklyTips = getTrimesterTips(trimester);

  return (
    <div className="space-y-6">
      <BabySizeCard
        gestationalAge={gestationalAge}
        weeksLeft={weeksLeft}
        progressPercentage={progressPercentage}
        trimester={trimester}
      />

      <DevelopmentCard developmentInfo={developmentInfo} />

      <WeeklyTipsCard weeklyTips={weeklyTips} />
    </div>
  );
}
