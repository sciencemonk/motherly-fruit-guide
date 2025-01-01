import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface LifestyleFieldProps {
  lifestyle: string;
  setLifestyle: (value: string) => void;
  isLoading: boolean;
}

export function LifestyleField({
  lifestyle,
  setLifestyle,
  isLoading
}: LifestyleFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="lifestyle" className="text-sage-700 text-lg">
        Tell Mother Athena more about yourself and your lifestyle
      </Label>
      <Textarea
        id="lifestyle"
        placeholder="Share details about your daily routine, exercise habits, diet preferences, work life, and any specific concerns you have about your pregnancy journey..."
        value={lifestyle}
        onChange={(e) => setLifestyle(e.target.value)}
        className="min-h-[150px] bg-white/80 backdrop-blur-sm border-sage-200 focus:border-sage-400 focus:ring-sage-400 text-sage-800 placeholder:text-sage-400"
        disabled={isLoading}
      />
    </div>
  );
}