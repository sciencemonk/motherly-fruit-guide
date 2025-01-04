import { ReactNode } from "react";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { PregnancyStatusStep } from "./steps/PregnancyStatusStep";
import { LocationStep } from "./steps/LocationStep";
import { DueDateStep } from "./steps/DueDateStep";
import { CycleInfoStep } from "./steps/CycleInfoStep";
import { InterestsStep } from "./steps/InterestsStep";
import { LifestyleStep } from "./steps/LifestyleStep";
import { NotificationTimeStep } from "./steps/NotificationTimeStep";
import { FinalStep } from "./steps/FinalStep";
import { ProgressIndicator } from "./ProgressIndicator";

interface RegistrationStepsProps {
  currentStep: number;
  totalSteps: number;
  formData: {
    firstName: string;
    phone: string;
    dueDate?: Date;
    lastPeriod?: Date;
    city: string;
    state: string;
    interests: string;
    lifestyle: string;
    preferredTime: string;
    smsConsent: boolean;
    pregnancyStatus: string;
  };
  setters: {
    setFirstName: (value: string) => void;
    setPhone: (value: string) => void;
    setDueDate: (date: Date | undefined) => void;
    setLastPeriod: (date: Date | undefined) => void;
    setCity: (value: string) => void;
    setState: (value: string) => void;
    setInterests: (value: string) => void;
    setLifestyle: (value: string) => void;
    setPreferredTime: (value: string) => void;
    setSmsConsent: (value: boolean) => void;
    setPregnancyStatus: (value: string) => void;
  };
  isLoading: boolean;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function RegistrationSteps({
  currentStep,
  totalSteps,
  formData,
  setters,
  isLoading,
  onNext,
  onBack,
  onSubmit
}: RegistrationStepsProps) {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 9);

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(today.getMonth() - 2);

  return (
    <div className="w-full">
      <div className="mb-6">
        <ProgressIndicator totalSteps={totalSteps} currentStep={currentStep} />
      </div>
      
      <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 md:p-8">
        {currentStep === 0 && (
          <BasicInfoStep
            firstName={formData.firstName}
            setFirstName={setters.setFirstName}
            phone={formData.phone}
            setPhone={setters.setPhone}
            isLoading={isLoading}
            onNext={onNext}
          />
        )}

        {currentStep === 1 && (
          <PregnancyStatusStep
            pregnancyStatus={formData.pregnancyStatus}
            setPregnancyStatus={setters.setPregnancyStatus}
            isLoading={isLoading}
            onBack={onBack}
            onNext={onNext}
          />
        )}

        {currentStep === 2 && (
          <LocationStep
            city={formData.city}
            setCity={setters.setCity}
            state={formData.state}
            setState={setters.setState}
            isLoading={isLoading}
            onBack={onBack}
            onNext={onNext}
          />
        )}

        {currentStep === 3 && (
          <>
            {formData.pregnancyStatus === 'expecting' ? (
              <DueDateStep
                dueDate={formData.dueDate}
                setDueDate={setters.setDueDate}
                today={today}
                maxDate={maxDate}
                isLoading={isLoading}
                onBack={onBack}
                onNext={onNext}
              />
            ) : (
              <CycleInfoStep
                lastPeriod={formData.lastPeriod}
                setLastPeriod={setters.setLastPeriod}
                isLoading={isLoading}
                onBack={onBack}
                onNext={onNext}
              />
            )}
          </>
        )}

        {currentStep === 4 && (
          <InterestsStep
            interests={formData.interests}
            setInterests={setters.setInterests}
            isLoading={isLoading}
            onBack={onBack}
            onNext={onNext}
            pregnancyStatus={formData.pregnancyStatus}
          />
        )}

        {currentStep === 5 && (
          <LifestyleStep
            lifestyle={formData.lifestyle}
            setLifestyle={setters.setLifestyle}
            isLoading={isLoading}
            onBack={onBack}
            onNext={onNext}
          />
        )}

        {currentStep === 6 && (
          <NotificationTimeStep
            preferredTime={formData.preferredTime}
            setPreferredTime={setters.setPreferredTime}
            isLoading={isLoading}
            onBack={onBack}
            onNext={onNext}
          />
        )}

        {currentStep === 7 && (
          <FinalStep
            smsConsent={formData.smsConsent}
            setSmsConsent={setters.setSmsConsent}
            isLoading={isLoading}
            onBack={onBack}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </div>
  );
}