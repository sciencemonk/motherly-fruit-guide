import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PregnancyStatusStepProps {
  pregnancyStatus: string;
  setPregnancyStatus: (value: string) => void;
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function PregnancyStatusStep({
  pregnancyStatus,
  setPregnancyStatus,
  isLoading,
  onBack,
  onNext
}: PregnancyStatusStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">Tell us about your journey</h2>
        <p className="text-sage-600 mb-6">This will help us personalize your experience with Mother Athena.</p>
      </div>

      <RadioGroup
        value={pregnancyStatus}
        onValueChange={setPregnancyStatus}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="expecting" id="expecting" />
          <Label htmlFor="expecting" className="text-lg">I'm expecting a baby</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="trying" id="trying" />
          <Label htmlFor="trying" className="text-lg">I'm trying to get pregnant</Label>
        </div>
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
          disabled={!pregnancyStatus || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}