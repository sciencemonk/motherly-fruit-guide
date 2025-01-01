import { useState } from "react";
import { StepIndicator } from "./registration/StepIndicator";
import { FormFields } from "./registration/FormFields";
import { useRegistrationSubmit } from "./registration/useRegistrationSubmit";
import { CityField } from "./registration/CityField";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { ConsentCheckbox } from "./registration/ConsentCheckbox";
import { SocialProof } from "./registration/SocialProof";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
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
        return city.length > 0 && state.length > 0;
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
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-sage-800 mb-2">Where are you located?</h2>
              <p className="text-sage-600">We'll use this to provide local resources and connect you with nearby moms.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Enter your state"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-sage-800 mb-2">When is your baby due?</h2>
              <p className="text-sage-600">We'll customize your experience based on your stage of pregnancy.</p>
            </div>
            <div className="mx-auto bg-white rounded-lg shadow p-4">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                className="rounded-md border"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-sage-800 mb-2">What interests you most about having a healthy baby?</h2>
              <p className="text-sage-600">This helps us personalize your experience.</p>
            </div>
            <RadioGroup value={interests} onValueChange={setInterests} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nutrition" id="nutrition" />
                <Label htmlFor="nutrition">Nutrition and diet during pregnancy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exercise" id="exercise" />
                <Label htmlFor="exercise">Safe exercise and staying active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="development" id="development" />
                <Label htmlFor="development">Baby's development and milestones</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mental" id="mental" />
                <Label htmlFor="mental">Mental health and emotional wellbeing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="preparation" id="preparation" />
                <Label htmlFor="preparation">Birth preparation and labor</Label>
              </div>
            </RadioGroup>
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
              placeholder="Share details about your daily routine, exercise habits, diet preferences, work life, and any specific concerns you have about your pregnancy journey..."
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