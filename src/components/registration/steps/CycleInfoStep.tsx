import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CycleInfoStepProps {
  lastPeriod: Date | undefined;
  setLastPeriod: (date: Date | undefined) => void;
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function CycleInfoStep({
  lastPeriod,
  setLastPeriod,
  isLoading,
  onBack,
  onNext
}: CycleInfoStepProps) {
  // Allow selection of dates up to today
  const today = new Date();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">When was the last day of your last period?</h2>
        <p className="text-sage-600 mb-6">This helps us predict your fertile window and provide personalized recommendations.</p>
      </div>

      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={lastPeriod}
          onSelect={setLastPeriod}
          disabled={(date) => date > today || isLoading}
          className={cn(
            "rounded-md border border-sage-200",
            "[&_.rdp-day_focus]:bg-sage-50",
            "[&_.rdp-day_hover]:bg-sage-100",
            "[&_.rdp-day_active]:bg-sage-500",
            "[&_.rdp-day_active]:text-white",
            "[&_.rdp-day_selected]:bg-sage-500",
            "[&_.rdp-day_selected]:text-white",
            "[&_.rdp-head_cell]:text-sage-600",
            "[&_.rdp-caption_label]:text-sage-700"
          )}
          initialFocus
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
          disabled={!lastPeriod || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}