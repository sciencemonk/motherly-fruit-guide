import { ReactNode } from "react";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { TimePreferenceStep } from "./steps/TimePreferenceStep";
import { FrameworkStep } from "./steps/FrameworkStep";
import { FinalStep } from "./steps/FinalStep";
import { ProgressIndicator } from "./ProgressIndicator";

interface RegistrationStepsProps {
  currentStep: number;
  totalSteps: number;
  formData: {
    firstName: string;
    phone: string;
    wakeTime: string;
    sleepTime: string;
    smsConsent: boolean;
  };
  setters: {
    setFirstName: (value: string) => void;
    setPhone: (value: string | undefined) => void;
    setWakeTime: (value: string) => void;
    setSleepTime: (value: string) => void;
    setSmsConsent: (value: boolean) => void;
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
          <TimePreferenceStep
            wakeTime={formData.wakeTime}
            setWakeTime={setters.setWakeTime}
            sleepTime={formData.sleepTime}
            setSleepTime={setters.setSleepTime}
            isLoading={isLoading}
            onBack={onBack}
            onNext={onNext}
          />
        )}

        {currentStep === 2 && (
          <FrameworkStep
            isLoading={isLoading}
            onBack={onBack}
            onNext={onNext}
          />
        )}

        {currentStep === 3 && (
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