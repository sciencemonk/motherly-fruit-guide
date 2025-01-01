import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormFields } from "./registration/FormFields";
import { ConsentCheckbox } from "./registration/ConsentCheckbox";
import { WelcomeMessage } from "./pregnancy-report/WelcomeMessage";
import { useRegistrationState } from "./registration/RegistrationState";
import { useRegistrationSubmit } from "./registration/useRegistrationSubmit";
import { addMonths } from "date-fns";
import { StepIndicator } from "./registration/StepIndicator";
import { SocialProof } from "./registration/SocialProof";
import { LifestyleField } from "./registration/LifestyleField";

export function RegistrationForm() {
  const {
    firstName,
    setFirstName,
    phone,
    setPhone,
    dueDate,
    setDueDate,
    interests,
    setInterests,
    lifestyle,
    setLifestyle,
    isSubmitted,
    setIsSubmitted,
    isLoading,
    setIsLoading,
    smsConsent,
    setSmsConsent,
    welcomeRef
  } = useRegistrationState();

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;

  const { handleSubmit } = useRegistrationSubmit();

  // Calculate the date range for due date selection
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = addMonths(today, 9);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit({
      firstName,
      phone,
      dueDate: dueDate!,
      interests,
      lifestyle,
      smsConsent,
      setIsLoading,
      setIsSubmitted
    });

    setTimeout(() => {
      welcomeRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-sage-800 text-center">
              Let's get to know you
            </h2>
            <FormFields
              firstName={firstName}
              setFirstName={setFirstName}
              phone={phone}
              setPhone={setPhone}
              dueDate={undefined}
              setDueDate={setDueDate}
              interests={undefined}
              setInterests={setInterests}
              today={today}
              maxDate={maxDate}
              isLoading={isLoading}
              showOnlyBasicInfo={true}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-sage-800 text-center">
              When is your baby due?
            </h2>
            <FormFields
              firstName={firstName}
              setFirstName={setFirstName}
              phone={phone}
              setPhone={setPhone}
              dueDate={dueDate}
              setDueDate={setDueDate}
              interests={interests}
              setInterests={setInterests}
              today={today}
              maxDate={maxDate}
              isLoading={isLoading}
              showOnlyDueDate={true}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-sage-800 text-center">
              Your Interests
            </h2>
            <FormFields
              firstName={firstName}
              setFirstName={setFirstName}
              phone={phone}
              setPhone={setPhone}
              dueDate={dueDate}
              setDueDate={setDueDate}
              interests={interests}
              setInterests={setInterests}
              today={today}
              maxDate={maxDate}
              isLoading={isLoading}
              showOnlyInterests={true}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-sage-800 text-center">
              Tell us about yourself
            </h2>
            <LifestyleField
              lifestyle={lifestyle}
              setLifestyle={setLifestyle}
              isLoading={isLoading}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-sage-800 text-center">
              Start Your Free Trial
            </h2>
            <p className="text-center text-sage-600">
              Join thousands of mothers who trust Mother Athena for daily pregnancy guidance
            </p>
            <SocialProof />
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-sage-800">
                    Premium Pregnancy Support
                  </h3>
                  <p className="text-sage-600 mt-2">
                    Get personalized daily tips and unlimited chat support
                  </p>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-sage-800">
                      $9.99<span className="text-base font-normal text-sage-600">/month</span>
                    </p>
                    <p className="text-sm text-sage-600 mt-1">
                      after 7-day free trial
                    </p>
                  </div>
                </div>
                <ConsentCheckbox
                  smsConsent={smsConsent}
                  setSmsConsent={setSmsConsent}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return firstName && phone;
      case 1:
        return dueDate;
      case 2:
        return interests;
      case 3:
        return lifestyle.length > 0;
      case 4:
        return smsConsent;
      default:
        return false;
    }
  };

  if (isSubmitted) {
    return (
      <div ref={welcomeRef}>
        <WelcomeMessage firstName={firstName} />
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-8 w-full max-w-md mx-auto">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        {renderStep()}
        <div className="flex justify-between space-x-4">
          {currentStep > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={isLoading}
              className="flex-1"
            >
              Back
            </Button>
          )}
          {currentStep < totalSteps - 1 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed() || isLoading}
              className="flex-1 bg-peach-300 hover:bg-peach-400 text-peach-900"
            >
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              className="flex-1 bg-peach-300 hover:bg-peach-400 text-peach-900 font-semibold py-3 text-lg"
              disabled={!canProceed() || isLoading}
            >
              {isLoading ? "Processing..." : "Start Free Trial"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}