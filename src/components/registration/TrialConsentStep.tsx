import { ConsentCheckbox } from "./ConsentCheckbox"
import { SocialProof } from "./SocialProof"

interface TrialConsentStepProps {
  smsConsent: boolean
  setSmsConsent: (checked: boolean) => void
}

export function TrialConsentStep({ smsConsent, setSmsConsent }: TrialConsentStepProps) {
  const handleConsentChange = (checked: boolean) => {
    console.log('Consent checkbox changed:', checked)
    setSmsConsent(checked)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">Start Your Free Trial</h2>
        <p className="text-sage-600">7 days of unlimited support, completely free</p>
      </div>
      <ConsentCheckbox 
        checked={smsConsent} 
        onCheckedChange={handleConsentChange}
      />
      <SocialProof />
    </div>
  )
}