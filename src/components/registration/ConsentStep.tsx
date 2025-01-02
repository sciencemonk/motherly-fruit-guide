import { ConsentCheckbox } from "./ConsentCheckbox";
import { SocialProof } from "./SocialProof";
import { DevelopmentPreview } from "./DevelopmentPreview";

interface ConsentStepProps {
  dueDate: Date;
  smsConsent: boolean;
  onSmsConsentChange: (value: boolean) => void;
}

export function ConsentStep({ dueDate, smsConsent, onSmsConsentChange }: ConsentStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">Start Your Free Trial</h2>
        <p className="text-sage-600">7 days free, then $9.99/month</p>
      </div>
      
      {/* Show development preview before consent */}
      <DevelopmentPreview dueDate={dueDate} />
      
      <ConsentCheckbox checked={smsConsent} onCheckedChange={onSmsConsentChange} />
      <SocialProof />
    </div>
  );
}