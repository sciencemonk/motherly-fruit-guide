import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface LocationStepProps {
  city: string;
  setCity: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function LocationStep({
  city,
  setCity,
  state,
  setState,
  isLoading,
  onBack,
  onNext
}: LocationStepProps) {
  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">Where are you located?</h2>
        <p className="text-sage-600 mb-6">We'll use this to provide local resources and connect you with nearby moms.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sage-700">City</Label>
          <Input
            id="city"
            placeholder="Enter your city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-white/80 backdrop-blur-sm border-sage-200 focus:border-sage-400 focus:ring-sage-400"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="text-sage-700">State</Label>
          <Select value={state} onValueChange={setState} disabled={isLoading}>
            <SelectTrigger className="w-full bg-white/80">
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((stateName) => (
                <SelectItem key={stateName} value={stateName}>
                  {stateName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          disabled={!city || !state || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}