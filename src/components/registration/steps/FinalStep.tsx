import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, Brain, Moon } from "lucide-react";

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
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">Ready to Begin Your Journey</h2>
        <p className="text-sage-600 mb-6">Here's how Ducil will help you master lucid dreaming:</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Phone className="h-6 w-6 text-sage-500" />
          </div>
          <div>
            <h3 className="font-medium text-sage-800">Text Your Dreams</h3>
            <p className="text-sm text-sage-600">Simply text your dreams to this number whenever you wake up. They'll be automatically stored and analyzed on your dashboard.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Brain className="h-6 w-6 text-sage-500" />
          </div>
          <div>
            <h3 className="font-medium text-sage-800">Reality Checks</h3>
            <p className="text-sm text-sage-600">We'll send you reality check reminders every 2 hours during your waking hours to build awareness.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Moon className="h-6 w-6 text-sage-500" />
          </div>
          <div>
            <h3 className="font-medium text-sage-800">Pre-sleep Meditation</h3>
            <p className="text-sm text-sage-600">Access guided meditations designed to enhance your lucid dreaming practice.</p>
          </div>
        </div>
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
          I agree to receive SMS messages from Ducil for dream journaling and reality checks. Message frequency varies, message and data rates may apply. Reply STOP to cancel at any time.
        </label>
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
          className="flex-1 bg-sage-500 hover:bg-sage-600"
          disabled={!smsConsent || isLoading}
        >
          Start Your Journey
        </Button>
      </div>
    </div>
  );
}