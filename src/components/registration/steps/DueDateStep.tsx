import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DueDateStepProps {
  dueDate: Date | undefined;
  setDueDate: (date: Date | undefined) => void;
  today: Date;
  maxDate: Date;
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function DueDateStep({
  dueDate,
  setDueDate,
  today,
  maxDate,
  isLoading,
  onBack,
  onNext
}: DueDateStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">When is your baby due?</h2>
        <p className="text-sage-600 mb-6">We'll customize your experience based on your stage of pregnancy.</p>
      </div>

      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={dueDate}
          onSelect={setDueDate}
          disabled={(date) => date < today || date > maxDate || isLoading}
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
          disabled={!dueDate || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}