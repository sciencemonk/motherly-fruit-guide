import { useEffect, useState } from "react";
import { PregnancyReport } from "./PregnancyReport";
import { FertilityReport } from "./FertilityReport";
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
    dueDate,
    setDueDate,
    lastPeriod,
    setLastPeriod,
    city,
    setCity,
    state,
    setState,
    interests,
    setInterests,
    lifestyle,
    setLifestyle,
    preferredTime,
    setPreferredTime,
    isSubmitted,
    setIsSubmitted,
    isLoading,
    setIsLoading,
    smsConsent,
    setSmsConsent,
    pregnancyStatus,
    setPregnancyStatus,
    reportRef,
    welcomeRef
  } = useRegistrationState();

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 8;

  const { handleSubmit } = useRegistrationSubmit();

  const onSubmit = async () => {
    await handleSubmit({
      firstName,
      phone,
      dueDate: dueDate!,
      lastPeriod,
      city,
      state,
      interests,
      lifestyle,
      preferredTime,
      smsConsent,
      pregnancyStatus,
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
        <div ref={reportRef} className="mt-8">
          {pregnancyStatus === 'expecting' ? (
            <PregnancyReport dueDate={dueDate!} firstName={firstName} />
          ) : (
            <FertilityReport firstName={firstName} />
          )}
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
          dueDate,
          lastPeriod,
          city,
          state,
          interests,
          lifestyle,
          preferredTime,
          smsConsent,
          pregnancyStatus
        }}
        setters={{
          setFirstName,
          setPhone,
          setDueDate,
          setLastPeriod,
          setCity,
          setState,
          setInterests,
          setLifestyle,
          setPreferredTime,
          setSmsConsent,
          setPregnancyStatus
        }}
        isLoading={isLoading}
        onNext={handleNext}
        onBack={handleBack}
        onSubmit={onSubmit}
      />
    </div>
  );
}