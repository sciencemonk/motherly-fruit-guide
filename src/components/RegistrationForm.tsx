import { useEffect, useState } from "react";
import { WelcomeMessage } from "./pregnancy-report/WelcomeMessage";
import { useRegistrationState } from "./registration/RegistrationState";
import { useRegistrationSubmit } from "./registration/useRegistrationSubmit";
import { RegistrationSteps } from "./registration/RegistrationSteps";

export function RegistrationForm() {
  const {
    firstName,
    setFirstName,
    phone,
    setPhone,
    wakeTime,
    setWakeTime,
    sleepTime,
    setSleepTime,
    isSubmitted,
    setIsSubmitted,
    isLoading,
    setIsLoading,
    smsConsent,
    setSmsConsent,
    reportRef,
    welcomeRef
  } = useRegistrationState();

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;

  const { handleSubmit } = useRegistrationSubmit();

  const onSubmit = async () => {
    await handleSubmit({
      firstName,
      phone,
      wakeTime,
      sleepTime,
      smsConsent,
      setIsLoading,
      setIsSubmitted
    });

    setTimeout(() => {
      welcomeRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 2000);
    }, 100);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  if (isSubmitted) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <div ref={welcomeRef}>
          <WelcomeMessage firstName={firstName} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 md:px-8">
      <RegistrationSteps
        currentStep={currentStep}
        totalSteps={totalSteps}
        formData={{
          firstName,
          phone,
          wakeTime,
          sleepTime,
          smsConsent
        }}
        setters={{
          setFirstName,
          setPhone,
          setWakeTime,
          setSleepTime,
          setSmsConsent
        }}
        isLoading={isLoading}
        onNext={handleNext}
        onBack={handleBack}
        onSubmit={onSubmit}
      />
    </div>
  );
}