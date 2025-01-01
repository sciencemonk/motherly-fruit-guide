import { useState } from "react";
import { StepIndicator } from "./registration/StepIndicator";
import { FormFields } from "./registration/FormFields";
import { useRegistrationSubmit } from "./registration/useRegistrationSubmit";
import { CityField } from "./registration/CityField";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { ConsentCheckbox } from "./registration/ConsentCheckbox";
import { SocialProof } from "./registration/SocialProof";

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [interests, setInterests] = useState("");
  const [lifestyle, setLifestyle] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { handleSubmit } = useRegistrationSubmit();

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dueDate) return;

    await handleSubmit({
      firstName,
      phone,
      city,
      dueDate,
      interests,
      lifestyle,
      smsConsent,
      setIsLoading,
      setIsSubmitted,
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return firstName.length > 0 && phone.length > 0;
      case 1:
        return city.length > 0;
      case 2:
        return dueDate !== undefined;
      case 3:
        return interests.length > 0;
      case 4:
        return lifestyle.length > 0;
      case 5:
        return smsConsent;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <FormFields
            firstName={firstName}
            setFirstName={setFirstName}
            phone={phone}
            setPhone={setPhone}
          />
        );
      case 1:
        return <CityField city={city} setCity={setCity} />;
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-sage-800 mb-2">When is your baby due?</h2>
              <p className="text-sage-600">We'll customize your experience based on your stage of pregnancy.</p>
            </div>
            <input
              type="date"
              value={dueDate?.toISOString().split('T')[0] || ''}
              onChange={(e) => setDueDate(new Date(e.target.value))}
              className="w-full p-2 border rounded-md"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-sage-800 mb-2">What interests you most about having a healthy baby?</h2>
              <p className="text-sage-600">This helps us personalize your experience.</p>
            </div>
            <textarea
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="w-full p-2 border rounded-md h-32"
              placeholder="Share your interests..."
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-sage-800 mb-2">Tell Mother Athena more about yourself and your lifestyle</h2>
              <p className="text-sage-600">This helps us provide more personalized support.</p>
            </div>
            <textarea
              value={lifestyle}
              onChange={(e) => setLifestyle(e.target.value)}
              className="w-full p-2 border rounded-md h-32"
              placeholder="Share about your lifestyle..."
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-sage-800 mb-2">Start Your Free Trial</h2>
              <p className="text-sage-600">7 days free, then $9.99/month</p>
            </div>
            <ConsentCheckbox checked={smsConsent} onCheckedChange={setSmsConsent} />
            <SocialProof />
          </div>
        );
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-sage-800">Welcome to Mother Athena!</h2>
        <p className="text-sage-600">Please check your phone for a welcome message.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      {renderStep()}
      <div className="flex justify-between mt-6">
        {currentStep > 0 && (
          <Button type="button" variant="outline" onClick={handleBack}>
            Back
          </Button>
        )}
        {currentStep < totalSteps - 1 ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={!isStepValid() || isLoading}
            className="ml-auto"
          >
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={!isStepValid() || isLoading}
            className="ml-auto bg-peach-500 hover:bg-peach-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Start Free Trial"
            )}
          </Button>
        )}
      </div>
    </form>
  );
}