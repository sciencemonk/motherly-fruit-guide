import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { convertLocalToUTC, convertUTCToLocal } from "@/utils/timeZone";

interface TimePickerFieldProps {
  preferredTime: string;
  setPreferredTime: (time: string) => void;
  city: string;
}

export function TimePickerField({
  preferredTime,
  setPreferredTime,
  city,
}: TimePickerFieldProps) {
  const handleTimeChange = (localTime: string) => {
    const utcTime = convertLocalToUTC(localTime, city);
    setPreferredTime(utcTime);
  };

  // Convert stored UTC time to local time for display
  const localTime = convertUTCToLocal(preferredTime, city);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">When would you like to receive your daily updates?</h2>
        <p className="text-sage-600">Mother Athena will send you personalized updates about your pregnancy journey at this time in your local timezone.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="preferredTime">Preferred Time (Your Local Time)</Label>
        <Input
          type="time"
          id="preferredTime"
          value={localTime}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
}