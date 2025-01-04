import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface LifestyleStepProps {
  lifestyle: string;
  setLifestyle: (value: string) => void;
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function LifestyleStep({
  lifestyle,
  setLifestyle,
  isLoading,
  onBack,
  onNext
}: LifestyleStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">Tell Mother Athena more about yourself and your lifestyle</h2>
        <p className="text-sage-600 mb-6">Share details about your daily routine, exercise habits, diet preferences, work life, and any specific concerns you have about your pregnancy journey...</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lifestyle" className="sr-only">Lifestyle details</Label>
        <Textarea
          id="lifestyle"
          value={lifestyle}
          onChange={(e) => setLifestyle(e.target.value)}
          className="min-h-[150px] bg-white/80 backdrop-blur-sm border-sage-200 focus:border-sage-400 focus:ring-sage-400"
          placeholder="Type your response here..."
          disabled={isLoading}
        />
      </div>

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
          disabled={!lifestyle || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}