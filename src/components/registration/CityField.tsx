import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CityFieldProps {
  city: string;
  setCity: (value: string) => void;
  isLoading: boolean;
}

export function CityField({
  city,
  setCity,
  isLoading
}: CityFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="city" className="text-sage-700 text-lg">
        What city do you live in?
      </Label>
      <Input
        id="city"
        placeholder="Enter your city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full bg-white/80 backdrop-blur-sm border-sage-200 focus:border-sage-400 focus:ring-sage-400 text-sage-800 placeholder:text-sage-400"
        disabled={isLoading}
      />
    </div>
  );
}