import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface FinalStepProps {
  smsConsent: boolean;
  setSmsConsent: (checked: boolean) => void;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export function FinalStep({
  smsConsent,
  setSmsConsent,
  isLoading,
  onBack,
  onSubmit
}: FinalStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">Start Your Free Trial</h2>
        <p className="text-sage-600 mb-6">7 days of unlimited support, completely free</p>
      </div>

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
          className="text-sm text-sage-700"
        >
          I agree to receive daily pregnancy tips and guidance via text message from Mother Athena. Message frequency varies, message and data rates may apply. Reply STOP to cancel at any time.
        </label>
      </div>

      <div className="bg-sage-50 p-4 rounded-lg space-y-2">
        <p className="text-center text-sage-600">Join thousands of happy mothers who trust Mother Athena</p>
        
        <div className="text-center space-y-2">
          <div className="font-semibold text-sage-700">Sarah</div>
          <div className="flex justify-center text-peach-500">
            {"★".repeat(5)}
          </div>
          <p className="text-sage-600 italic">
            "Mother Athena has been incredible during my pregnancy journey. The daily tips and ability to ask questions anytime is so reassuring."
          </p>
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
          onClick={onSubmit}
          className="flex-1 bg-peach-500 hover:bg-peach-600 text-white"
          disabled={!smsConsent || isLoading}
        >
          Start Free Trial
        </Button>
      </div>
    </div>
  );
}