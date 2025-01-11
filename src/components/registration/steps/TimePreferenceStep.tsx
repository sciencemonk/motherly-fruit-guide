import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";

interface TimePreferenceStepProps {
  wakeTime: string;
  setWakeTime: (value: string) => void;
  sleepTime: string;
  setSleepTime: (value: string) => void;
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function TimePreferenceStep({
  wakeTime,
  setWakeTime,
  sleepTime,
  setSleepTime,
  isLoading,
  onBack,
  onNext
}: TimePreferenceStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">Your Daily Schedule</h2>
        <p className="text-sage-600 mb-6">We'll send you reality checks during your waking hours to help build awareness.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wakeTime" className="text-sage-700">What time do you usually wake up?</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-2.5 h-5 w-5 text-sage-500" />
            <Input
              type="time"
              id="wakeTime"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="pl-10 w-full bg-white/80 backdrop-blur-sm border-sage-200 focus:border-sage-400 focus:ring-sage-400"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sleepTime" className="text-sage-700">What time do you usually go to sleep?</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-2.5 h-5 w-5 text-sage-500" />
            <Input
              type="time"
              id="sleepTime"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              className="pl-10 w-full bg-white/80 backdrop-blur-sm border-sage-200 focus:border-sage-400 focus:ring-sage-400"
              disabled={isLoading}
            />
          </div>
        </div>
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
          disabled={!wakeTime || !sleepTime || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}