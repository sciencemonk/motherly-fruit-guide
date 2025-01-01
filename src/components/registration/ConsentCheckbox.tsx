import { Checkbox } from "@/components/ui/checkbox";

interface ConsentCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function ConsentCheckbox({ checked, onCheckedChange }: ConsentCheckboxProps) {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox 
        id="sms-consent" 
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
        className="mt-1"
      />
      <label
        htmlFor="sms-consent"
        className="text-xs peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sage-700"
      >
        I agree to receive daily pregnancy tips and guidance via text message from Mother Athena. I understand that I'll get a 7-day free trial, after which I'll be charged $9.99/month unless I cancel. Message frequency varies, message and data rates may apply. Reply STOP to cancel at any time.
      </label>
    </div>
  );
}