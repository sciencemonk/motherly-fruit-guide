import { useState } from "react";

interface DevelopmentPreviewProps {
  dueDate: Date;
}

export function DevelopmentPreview({ dueDate }: DevelopmentPreviewProps) {
  // Calculate weeks based on due date
  const today = new Date();
  const gestationalAge = 40 - Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7));

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

  const developmentInfo = getDevelopmentInfo(gestationalAge);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">Your Baby's Development</h2>
        <p className="text-sage-600">Week {gestationalAge}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-sage-700">{developmentInfo}</p>
      </div>
    </div>
  );
}