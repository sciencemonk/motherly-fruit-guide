import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface InterestsStepProps {
  interests: string;
  setInterests: (value: string) => void;
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
  pregnancyStatus: string;
}

export function InterestsStep({
  interests,
  setInterests,
  isLoading,
  onBack,
  onNext,
  pregnancyStatus
}: InterestsStepProps) {
  const getInterestOptions = () => {
    if (pregnancyStatus === 'trying') {
      return [
        "Optimizing your menstrual cycle and ovulation tracking",
        "Nutrition and supplements for fertility",
        "Environmental factors affecting fertility",
        "Stress management and emotional wellbeing",
        "Exercise and lifestyle changes for fertility"
      ];
    }
    return [
      "Nutrition and diet during pregnancy",
      "Safe exercise and staying active",
      "Baby's development and milestones",
      "Mental health and emotional wellbeing",
      "Birth preparation and labor"
    ];
  };

  const interestOptions = getInterestOptions();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">
          {pregnancyStatus === 'trying' 
            ? "What areas are you most interested in helping your fertility?"
            : "What interests you most about having a healthy baby?"}
        </h2>
        <p className="text-sage-600 mb-6">This helps us personalize your experience.</p>
      </div>

      <RadioGroup value={interests} onValueChange={setInterests} className="space-y-4">
        {interestOptions.map((option) => (
          <div key={option} className="flex items-center space-x-3">
            <RadioGroupItem value={option} id={option} disabled={isLoading} />
            <Label htmlFor={option} className="text-sage-700">{option}</Label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 bg-sage-500 hover:bg-sage-600"
          disabled={!interests || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}