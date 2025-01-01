import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TimePickerFieldProps {
  preferredTime: string;
  setPreferredTime: (time: string) => void;
}

export function TimePickerField({
  preferredTime,
  setPreferredTime,
}: TimePickerFieldProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">When would you like to receive your daily updates?</h2>
        <p className="text-sage-600">Mother Athena will send you personalized updates about your pregnancy journey at this time.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="preferredTime">Preferred Time</Label>
        <Input
          type="time"
          id="preferredTime"
          value={preferredTime}
          onChange={(e) => setPreferredTime(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
}