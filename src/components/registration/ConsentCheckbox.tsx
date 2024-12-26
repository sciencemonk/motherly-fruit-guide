import { Checkbox } from "@/components/ui/checkbox";

interface ConsentCheckboxProps {
  smsConsent: boolean;
  setSmsConsent: (checked: boolean) => void;
  isLoading: boolean;
}

export function ConsentCheckbox({ smsConsent, setSmsConsent, isLoading }: ConsentCheckboxProps) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Checkbox 
        id="sms-consent" 
        checked={smsConsent}
        onCheckedChange={(checked) => setSmsConsent(checked as boolean)}
        disabled={isLoading}
      />
      <label
        htmlFor="sms-consent"
        className="text-xs whitespace-nowrap peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sage-700"
      >
        I agree to the terms of service, privacy notice, and to receive text messages from Mother Athena to answer my pregnancy questions!
      </label>
    </div>
  );
}