import { FormFields } from "./FormFields"
import { StateSelector } from "./StateSelector"
import { TimePickerField } from "./TimePickerField"
import { TrialConsentStep } from "./TrialConsentStep"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { LifestyleField } from "./LifestyleField"

interface RegistrationStepsProps {
  currentStep: number
  firstName: string
  setFirstName: (value: string) => void
  phone: string
  setPhone: (value: string) => void
  city: string
  setCity: (value: string) => void
  state: string
  setState: (value: string) => void
  dueDate: Date | undefined
  setDueDate: (value: Date | undefined) => void
  interests: string
  setInterests: (value: string) => void
  lifestyle: string
  setLifestyle: (value: string) => void
  preferredTime: string
  setPreferredTime: (value: string) => void
  smsConsent: boolean
  setSmsConsent: (value: boolean) => void
}

export function RegistrationSteps({
  currentStep,
  firstName,
  setFirstName,
  phone,
  setPhone,
  city,
  setCity,
  state,
  setState,
  dueDate,
  setDueDate,
  interests,
  setInterests,
  lifestyle,
  setLifestyle,
  preferredTime,
  setPreferredTime,
  smsConsent,
  setSmsConsent
}: RegistrationStepsProps) {
  switch (currentStep) {
    case 0:
      return (
        <FormFields
          firstName={firstName}
          setFirstName={setFirstName}
          phone={phone}
          setPhone={setPhone}
        />
      )
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
            <StateSelector state={state} setState={setState} />
          </div>
        </div>
      )
    case 2:
      return (
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-sage-800 mb-2">When is your baby due?</h2>
            <p className="text-sage-600">We'll customize your experience based on your stage of pregnancy.</p>
          </div>
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow p-4">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                className="rounded-md border"
              />
            </div>
          </div>
        </div>
      )
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
      )
    case 4:
      return (
        <LifestyleField
          lifestyle={lifestyle}
          setLifestyle={setLifestyle}
          isLoading={false}
        />
      )
    case 5:
      return (
        <TimePickerField
          preferredTime={preferredTime}
          setPreferredTime={setPreferredTime}
          city={city}
        />
      )
    case 6:
      return (
        <TrialConsentStep
          smsConsent={smsConsent}
          setSmsConsent={setSmsConsent}
        />
      )
    default:
      return null
  }
}