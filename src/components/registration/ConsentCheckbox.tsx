import { Checkbox } from "@/components/ui/checkbox";

interface ConsentCheckboxProps {
  smsConsent: boolean;
  setSmsConsent: (checked: boolean) => void;
  isLoading: boolean;
}

export function ConsentCheckbox({ smsConsent, setSmsConsent, isLoading }: ConsentCheckboxProps) {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox 
        id="sms-consent" 
        checked={smsConsent}
        onCheckedChange={(checked) => setSmsConsent(checked as boolean)}
        disabled={isLoading}
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