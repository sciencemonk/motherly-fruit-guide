import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CityFieldProps {
  city: string;
  setCity: (city: string) => void;
}

export function CityField({ city, setCity }: CityFieldProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">What city do you live in?</h2>
        <p className="text-sage-600">We'll use this to provide local resources and connect you with nearby moms.</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          type="text"
          placeholder="Enter your city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
}