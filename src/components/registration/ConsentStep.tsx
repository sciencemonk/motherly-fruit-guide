import { ConsentCheckbox } from "./ConsentCheckbox";
import { SocialProof } from "./SocialProof";

interface ConsentStepProps {
  smsConsent: boolean;
  onSmsConsentChange: (value: boolean) => void;
}

export function ConsentStep({ smsConsent, onSmsConsentChange }: ConsentStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">Start Your Free Trial</h2>
        <p className="text-sage-600">7 days free, then $9.99/month</p>
      </div>
      
      <ConsentCheckbox checked={smsConsent} onCheckedChange={onSmsConsentChange} />
      <SocialProof />
    </div>
  );
}