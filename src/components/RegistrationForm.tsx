import { useEffect, useState } from "react";
import { addMonths } from "date-fns";
import { PregnancyReport } from "./PregnancyReport";
import { FertilityReport } from "./FertilityReport";
import { WelcomeMessage } from "./pregnancy-report/WelcomeMessage";
import { useRegistrationState } from "./registration/RegistrationState";
import { useRegistrationSubmit } from "./registration/useRegistrationSubmit";
import { BasicInfoStep } from "./registration/steps/BasicInfoStep";
import { PregnancyStatusStep } from "./registration/steps/PregnancyStatusStep";
import { LocationStep } from "./registration/steps/LocationStep";
import { DueDateStep } from "./registration/steps/DueDateStep";
import { CycleInfoStep } from "./registration/steps/CycleInfoStep";
import { InterestsStep } from "./registration/steps/InterestsStep";
import { LifestyleStep } from "./registration/steps/LifestyleStep";
import { NotificationTimeStep } from "./registration/steps/NotificationTimeStep";
import { FinalStep } from "./registration/steps/FinalStep";
import { ProgressIndicator } from "./registration/ProgressIndicator";

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

  // Calculate the date range for due date selection
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = addMonths(today, 9);

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
      <div>
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
    <div className="w-full max-w-md mx-auto">
      <ProgressIndicator totalSteps={totalSteps} currentStep={currentStep} />
      
      {currentStep === 0 && (
        <BasicInfoStep
          firstName={firstName}
          setFirstName={setFirstName}
          phone={phone}
          setPhone={setPhone}
          isLoading={isLoading}
          onNext={handleNext}
        />
      )}

      {currentStep === 1 && (
        <PregnancyStatusStep
          pregnancyStatus={pregnancyStatus}
          setPregnancyStatus={setPregnancyStatus}
          isLoading={isLoading}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {currentStep === 2 && (
        <LocationStep
          city={city}
          setCity={setCity}
          state={state}
          setState={setState}
          isLoading={isLoading}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {currentStep === 3 && (
        <>
          {pregnancyStatus === 'expecting' ? (
            <DueDateStep
              dueDate={dueDate}
              setDueDate={setDueDate}
              today={today}
              maxDate={maxDate}
              isLoading={isLoading}
              onBack={handleBack}
              onNext={handleNext}
            />
          ) : (
            <CycleInfoStep
              lastPeriod={lastPeriod}
              setLastPeriod={setLastPeriod}
              isLoading={isLoading}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}
        </>
      )}

      {currentStep === 4 && (
        <InterestsStep
          interests={interests}
          setInterests={setInterests}
          isLoading={isLoading}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {currentStep === 5 && (
        <LifestyleStep
          lifestyle={lifestyle}
          setLifestyle={setLifestyle}
          isLoading={isLoading}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {currentStep === 6 && (
        <NotificationTimeStep
          preferredTime={preferredTime}
          setPreferredTime={setPreferredTime}
          isLoading={isLoading}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {currentStep === 7 && (
        <FinalStep
          smsConsent={smsConsent}
          setSmsConsent={setSmsConsent}
          isLoading={isLoading}
          onBack={handleBack}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}