import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface NotificationTimeStepProps {
  preferredTime: string;
  setPreferredTime: (value: string) => void;
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function NotificationTimeStep({
  preferredTime,
  setPreferredTime,
  isLoading,
  onBack,
  onNext
}: NotificationTimeStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">When would you like to receive your daily updates?</h2>
        <p className="text-sage-600 mb-6">Mother Athena will send you personalized updates about your pregnancy journey at this time in your local timezone.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredTime" className="text-sage-700">Preferred Time (Your Local Time)</Label>
        <Input
          type="time"
          id="preferredTime"
          value={preferredTime}
          onChange={(e) => setPreferredTime(e.target.value)}
          className="w-full bg-white/80 backdrop-blur-sm border-sage-200 focus:border-sage-400 focus:ring-sage-400"
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
          disabled={!preferredTime || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}