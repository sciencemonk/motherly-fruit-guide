import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StateSelectorProps {
  state: string;
  setState: (state: string) => void;
}

export function StateSelector({ state, setState }: StateSelectorProps) {
  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
    "Wisconsin", "Wyoming"
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="state">State</Label>
      <Select value={state} onValueChange={setState}>
        <SelectTrigger id="state" className="w-full">
          <SelectValue placeholder="Select your state" />
        </SelectTrigger>
        <SelectContent position="item-aligned" side="bottom" align="start" sideOffset={4}>
          {states.map((stateName) => (
            <SelectItem key={stateName} value={stateName}>
              {stateName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}