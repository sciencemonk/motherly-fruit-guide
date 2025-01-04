import { Checkbox } from "@/components/ui/checkbox";

interface ConsentCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function ConsentCheckbox({ checked, onCheckedChange }: ConsentCheckboxProps) {
  return (
    <div className="flex items-start space-x-3">
      <Checkbox
        id="consent"
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-1"
      />
      <label htmlFor="consent" className="text-sm text-sage-600">
        I agree to receive daily pregnancy tips and guidance via text message from Mother Athena.
        Message frequency varies, message and data rates may apply. Reply STOP to cancel at any time.
      </label>
    </div>
  );
}